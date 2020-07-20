import React, { useEffect, useContext } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NIcreate,
  NIreadById,
  NIdeleteById,
  NIupdateById,
  NIaddIngredient,
  NIaddIngredientAndUpdate,
} from "../logic/nutrition/NutritionLogic";
import useObjectState from "../common/useObjectState";
import TextWithEdit from "./generic/TextWithEdit";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { TestContext, NutritionContext } from "../App";
import SelectList from "./generic/SelectList";

const useStyles = createUseStyles({
  wrapper: {
    background: "#84d9b0",
    borderRadius: "10px",
    margin: "10px",
    padding: "5px",
  },
  info: {
    width: "100%",
    padding: "5px",
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  buttons: {
    width: "100%",
    padding: "5px",

    "& > div": {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      "& > button": {
        flexGrow: 1,
      },
    },
  },
});

export enum NutritionItemModes {
  Show,
  Edit,
  New,
}

interface Props {
  item: NutritionItem;
  initialMode: NutritionItemModes;
}

const NutritionListItem = ({ item, initialMode }: Props) => {
  const {
    obj: itemState,
    setObj: setItemState,
    updateProperty: updateItemProperty,
    resetObj: resetItemState,
  }: {
    obj: NutritionItem;
    setObj: any;
    updateProperty: any;
    resetObj: any;
  } = useObjectState(item);

  const {
    items: allNutritionItems,
    getOneById: getNutriitionItemByIdFromContext,
    refresh: refreshNIContext,
  } = useContext(NutritionContext);

  const [mode, setMode] = useState(initialMode);

  const [ingredients, setIngredients]: [NutritionItem[], Function] = useState(
    []
  );

  useEffect(() => {
    // console.log(
    //   "useEffect forceItemFromProp called. item prop: ",
    //   item.title,
    //   "item state: ",
    //   itemState.title
    // );
    setItemState(item);
    readAllIngredients();
  }, [item]);

  const classes = useStyles();

  async function readIngredient(id: string) {
    const ingredient: NutritionItem = await NIreadById(id);
    return ingredient;
  }

  async function readAllIngredients() {
    console.log("readAllIngredients called");

    asyncForEach(itemState.ingredientIds, async (id: any) => {
      const ingredient: NutritionItem = await NIreadById(id);
      console.log("ingredient: ", ingredient);

      setIngredients([...ingredients, ingredient]);
    });
  }

  async function asyncForEach(array: Array<any>, callback: Function) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  function handleSave() {
    NIupdateById(itemState).then(() => refreshNIContext());
    setMode(NutritionItemModes.Show);
  }

  function handleCancel() {
    setMode(NutritionItemModes.Show);
    resetItemState();
  }

  function handleDelete() {
    NIdeleteById(itemState._id).then(() => refreshNIContext());
  }

  function handleCreate() {
    NIcreate(itemState).then(() => refreshNIContext());
  }

  function handleReset() {
    resetItemState();
  }

  async function handleIngredientSelectOnExisting(
    ingredientId: NutritionItem["_id"]
  ) {
    setItemState(NIaddIngredientAndUpdate(itemState, ingredientId));
    // NIupdateById(itemState).then(() => refreshNIContext());
  }

  async function NIreadByIdAsync(id: NutritionItem["_id"]) {
    return await NIreadById(id);
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.info}>
        <TextWithEdit
          text={itemState.title}
          className={classes.title}
          isEdit={
            mode === NutritionItemModes.Edit || mode === NutritionItemModes.New
          }
          handleChange={(newText: string) => {
            updateItemProperty("title", newText);
          }}
          onEnter={
            mode === NutritionItemModes.New
              ? () => handleCreate()
              : mode === NutritionItemModes.Edit
              ? () => handleSave()
              : () => {}
          }
        />
        {itemState.ingredientIds.map(
          (id: string) =>
            getNutriitionItemByIdFromContext(id) && (
              <NutritionItemCompact
                item={getNutriitionItemByIdFromContext(id)}
                initialMode={NutritionItemModes.Show}
                refresh={() => refreshNIContext()}
              />
            )
        )}
        <SelectList
          children={allNutritionItems.map((ni) => ({
            id: ni._id,
            node: ni.title,
            selected: false,
          }))}
          handleChangeSelection={(id: string) => console.log(id)}
        />
      </div>
      <div className={classes.buttons}>
        {mode === NutritionItemModes.Show && (
          <div>
            <button onClick={() => setMode(NutritionItemModes.Edit)}>
              edit
            </button>
            <button onClick={() => handleDelete()}>delete</button>
          </div>
        )}
        {mode === NutritionItemModes.Edit && (
          <div>
            <button onClick={() => handleSave()}>save</button>
            <button onClick={() => handleCancel()}>cancel</button>
          </div>
        )}
        {mode === NutritionItemModes.New && (
          <div>
            <button onClick={() => handleCreate()}>create</button>
            <button onClick={() => handleReset()}>reset</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionListItem;
