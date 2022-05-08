import React, { ReactNode } from "react";
import { useState } from "react";
import { useNutrition } from "../../logic/nutritionItemLogic";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import { createContextDefined } from "../../context/ContextWrapper";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import Removable from "../generic/Removable";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";
import { Button } from "../generic/buttons/Button";
import { Icon, IconSizes } from "../generic/styling/Icon";
import { NutritionItemData, nutritionItemDefaults } from "shared";

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

const [useThisContext, Provider] =
  createContextDefined<ReturnType<typeof useNutrition>>();

export interface NutritionFieldsProps {
  data: NutritionItemData;
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
  const { mode, data, create, reset, update, setMode } = useThisContext();
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
  const { data: nutrition, addIngredient, removeIngredient } = useThisContext();
  const classes = useStyles();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { all, create /* getOneFromContext */ } = NutritionItemContext.use();

  const ingredients = all?.filter(
    (item) =>
      item._id !== nutrition._id && nutrition.ingredientIds.includes(item._id)
  );

  const dropdownItems = all?.filter(
    (item) =>
      item._id !== nutrition._id &&
      !nutrition.ingredientIds.includes(item._id) &&
      !nutrition.ingredientIdsFlat.includes(item._id)
  );

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
      {/* <div>
        DEBUG: flat ingredients:{" "}
        {nutrition.ingredientIdsFlat.map(
          (id) => getOneFromContext(id)?.title + "; "
        )}
      </div> */}
    </div>
  );
};

const Delete = () => {
  const { remove, mode } = useThisContext();
  return <DeleteButton onDelete={() => remove && remove()} mode={mode} />;
};

export const NutritionFields = { Wrapper, Buttons, Title, Ingredients, Delete };
