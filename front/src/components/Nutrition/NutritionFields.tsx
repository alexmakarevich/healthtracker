import React, { ReactNode, useEffect } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NILogic,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import TextWithEditAndState from "../generic/TextWithEditAndState";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import {
  EntityBaseContextUseQuery,
  useEntityBaseUseQuery,
} from "../../hooks/useEntityBase";
import { createContextDefined } from "../../context/ContextWrapper";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { ExerciseInstanceDAO } from "../../logic/exerciseInstanceLogic";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import Removable from "../generic/Removable";
import { SimpleRow } from "../generic/layout/SimpleRow";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";

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
  EntityBaseContextUseQuery<NutritionItem>
>();

export interface NutritionProps {
  item: NutritionItem;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ item, initialMode, children }: NutritionProps) => {
  const contextProps = useEntityBaseUseQuery(
    item,
    useNutritionItemContext(),
    initialMode
  );

  return <Provider value={contextProps}>{children}</Provider>;
};

const Buttons = () => {
  const {
    mode,
    handleCreate,
    reset,
    handleSave,
    handleCancel,
    setMode,
  } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={handleCreate}
      onReset={reset}
      onSave={handleSave}
      onCancelEdit={handleCancel}
      onSetMode={setMode}
      valid
    />
  );
};

const Title = () => {
  const { mode, complexState, handleSetOrUpdate } = useThisContext();

  return (
    // TODO: only update when clicking away / onEnter
    <TextWithEdit
      text={complexState.title}
      onTextChange={(txt) => handleSetOrUpdate({ title: txt })}
      isEdit={mode !== ItemModes.Show}
    />
  );
};

const Ingredients = () => {
  const { mode, complexState: nutrition, handleSetOrUpdate } = useThisContext();
  const classes = useStyles();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // TODO: come up wtih function that splits an array in two based on condition

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
    handleSetOrUpdate(NILogic.add_ingredient(nutrition, id));
  }

  function removeIngredient(id: string) {
    handleSetOrUpdate(NILogic.remove_ingredient(nutrition, id));
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
            <Wrapper item={ingredient} initialMode={ItemModes.Show}>
              <Title />
            </Wrapper>
          </Box>
        </Removable>
      ))}
      <div className={classes.addSection}>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={!isAddOpen}>
          <button onClick={() => setIsAddOpen(true)}>+</button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <button onClick={() => setIsAddOpen(false)}>cancel</button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <div className={classes.wrapper}>
            <PickOrAdd
              dropdownItems={dropdownItems?.map((item) => {
                return {
                  id: item._id,
                  node: (
                    <Box>
                      <Wrapper item={item} initialMode={ItemModes.Show}>
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
  const { handleDelete, mode } = useThisContext();

  return <DeleteButton onDelete={handleDelete} mode={mode} />;
};

const NutritionFields = { Wrapper, Buttons, Title, Ingredients, Delete };

export { NutritionFields };
