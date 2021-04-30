import React, { ReactNode, useEffect } from "react";
import { useState } from "react";
import {
  NutritionItemDAO,
  NILogic,
  nutritionItemDefaults,
  useNutrition,
} from "../../logic/nutritionItemLogic";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import TextWithEditAndState from "../generic/TextWithEditAndState";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import { createContextDefined } from "../../context/ContextWrapper";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { ExerciseInstanceDAO } from "../../logic/exerciseInstanceLogic";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import Removable from "../generic/Removable";
import { SimpleRow } from "../generic/layout/SimpleRow";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";
import { Button } from "../generic/buttons/Button";
import { Icon, IconSizes } from "../generic/styling/Icon";

const useStyles = createUseStyles(
  {
    outerWrapper: {
      margin: "5px",
      width: "100%",
    },
    info: {
      padding: "5px",
      display: "flex",
      justifyContent: "center",
    },
    wrapper: {
      margin: "5px",
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
    },
    addSection: {
      display: "flex",
      alignItems: "center",
      padding: "0 5px",
    },
  },
  { name: "NutritionListItem" }
);

const [useThisContext, Provider] = createContextDefined<
  ReturnType<typeof useNutrition>
>();

export interface NutritionFieldsProps {
  data: NutritionItemDAO;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ data, initialMode, children }: NutritionFieldsProps) => {
  const contextProps = useNutrition({
    data,
    initialMode,
  });

  return <Provider value={contextProps}>{children}</Provider>;
};

const Buttons = () => {
  const {
    mode,
    data,
    create,
    reset,
    setData,
    update,
    setMode,
  } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={() => create && create(data)}
      onReset={reset}
      onSave={update}
      onCancelEdit={() => setMode(ItemModes.Show)}
      onSetMode={setMode}
      isFlexRow
      valid
    />
  );
};

const Title = () => {
  const { mode, data, setOrUpdateDebounced } = useThisContext();

  return (
    <TextWithEdit
      text={data.title}
      onTextChange={(txt) => setOrUpdateDebounced({ ...data, title: txt })}
      isEdit={mode !== ItemModes.Show}
    />
  );
};

const Ingredients = () => {
  const { mode, data: nutrition, setOrUpdate } = useThisContext();
  const classes = useStyles();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { all, create } = useNutritionItemContext();

  const ingredients = all?.filter(
    (item) =>
      item._id !== nutrition._id && nutrition.ingredientIds.includes(item._id)
  );

  const dropdownItems = all?.filter(
    (item) =>
      item._id !== nutrition._id && !nutrition.ingredientIds.includes(item._id)
  );

  function addIngredient(id: string) {
    setOrUpdate(NILogic.add_ingredient(nutrition, id));
  }

  function removeIngredient(id: string) {
    setOrUpdate(NILogic.remove_ingredient(nutrition, id));
  }

  function handleCreateAndAdd(title: string) {
    create(
      { ...nutritionItemDefaults, title: title },
      {
        onSuccess: (data) => {
          addIngredient(data._id);
          console.log("add ni", data._id);
        },
      }
    );
  }

  return (
    <div className={classes.wrapper}>
      {ingredients?.map((ingredient) => (
        <Removable
          onRemove={() => removeIngredient(ingredient._id)}
          key={ingredient._id}
        >
          <Box>
            <Wrapper data={ingredient} initialMode={ItemModes.Show}>
              <Title />
            </Wrapper>
          </Box>
        </Removable>
      ))}
      <div className={classes.addSection}>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={!isAddOpen}>
          <Button onClick={() => setIsAddOpen(true)}>
            <Icon icon={"plus"} size={IconSizes.S} />
          </Button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <Button onClick={() => setIsAddOpen(false)}>
            <Icon icon={"undo"} size={IconSizes.S} />
          </Button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <div className={classes.wrapper}>
            <PickOrAdd
              dropdownItems={dropdownItems?.map((item) => {
                return {
                  id: item._id,
                  node: (
                    <Box>
                      <Wrapper data={item} initialMode={ItemModes.Show}>
                        <Title />
                      </Wrapper>
                    </Box>
                  ),
                  isSelected: false,
                  searchableText: item.title,
                };
              })}
              onSelect={addIngredient}
              onCreateNew={handleCreateAndAdd}
            />
          </div>
        </Collapsible>
      </div>
    </div>
  );
};

const Delete = () => {
  const { remove, mode } = useThisContext();
  return <DeleteButton onDelete={() => remove && remove()} mode={mode} />;
};

export const NutritionFields = { Wrapper, Buttons, Title, Ingredients, Delete };
