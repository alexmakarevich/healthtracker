import React, { useEffect, useContext } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NutritionItemAPI,
  NILogic,
} from "../../logic/nutrition/NutritionLogic";
import useObjectState from "../../common/useObjectState";
import TextWithEdit from "./../generic/TextWithEdit";
import Removable from "./../generic/Removable";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { NutritionContext } from "../../App";
import Ingredients from "./Ingredients";
import SearchWithDropdown from "./../generic/SearchWithDropdown";

const useStyles = createUseStyles(
  {
    outerWrapper: {
      margin: "5px",
    },
    innerWrapper: {
      background: "#84d9b0",
      borderRadius: "10px",
      padding: "10px",
    },
    info: {
      padding: "5px",
      display: "flex",
      justifyContent: "center",
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    buttons: {
      width: "auto",
      padding: "5px",

      "& > div": {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        "& > button": {
          flexGrow: 1,
        },
      },
    },
  },
  { name: "NutritionListItem" }
);

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
    items: allNIfromContext,
    getOneById: NIfromContextById,
    refresh: refreshNIContext,
  } = useContext(NutritionContext);

  const [mode, setMode] = useState(initialMode);

  const [ingredients, setIngredients]: [NutritionItem[], Function] = useState(
    []
  );

  const [ingredientSearch, setIngredientSearch] = useState("");

  useEffect(() => {
    setItemState(item);
    readAllIngredients();
  }, [item]);

  const classes = useStyles();

  async function readIngredient(id: string) {
    const ingredient: NutritionItem = await NutritionItemAPI.READ_BY_ID(id);
    return ingredient;
  }

  async function readAllIngredients() {
    console.log("readAllIngredients called");

    asyncForEach(itemState.ingredientIds, async (id: any) => {
      const ingredient: NutritionItem = await NutritionItemAPI.READ_BY_ID(id);
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
    NutritionItemAPI.UPDATE_BY_ID(itemState).then(() => refreshNIContext());
    setMode(NutritionItemModes.Show);
  }

  function handleCancel() {
    setMode(NutritionItemModes.Show);
    resetItemState();
  }

  function handleDelete() {
    NutritionItemAPI.DELETE_BY_ID(itemState._id).then(() => refreshNIContext());
  }

  function handleCreate() {
    NutritionItemAPI.CREATE(itemState).then(() => refreshNIContext());
  }

  function handleReset() {
    resetItemState();
  }

  return (
    <div className={classes.outerWrapper}>
      <Removable onRemove={() => handleDelete()}>
        <div className={classes.innerWrapper}>
          <div className={classes.info}>
            <div className={classes.buttons}>
              {mode === NutritionItemModes.Show && (
                <button onClick={() => setMode(NutritionItemModes.Edit)}>
                  edit
                </button>
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
            <TextWithEdit
              text={itemState.title}
              className={classes.title}
              isEdit={
                mode === NutritionItemModes.Edit ||
                mode === NutritionItemModes.New
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
          </div>
        </div>
        <Ingredients
          ids={itemState.ingredientIds}
          onRemove={(id: NutritionItem["_id"]) =>
            setItemState(
              NILogic.Transformations.remove_ingredient(itemState, id)
            )
          }
        />
      </Removable>
    </div>
  );
};

export default NutritionListItem;
