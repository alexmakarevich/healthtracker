import React, { useEffect, useContext } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NutritionItemAPI,
  NILogic,
} from "../../logic/nutrition/NutritionLogic";
import useObjectState from "../../common/useObjectState";
import TextWithEdit from "../generic/TextWithEdit";
import Removable from "../generic/Removable";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { NutritionContext } from "../../App";
import Ingredients from "./Ingredients";
import SearchWithDropdown from "../generic/SearchWithDropdown";

const useStyles = createUseStyles(
  {
    outerWrapper: {
      margin: "5px",
      width: "100%",
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
      padding: "5px",

      "& > div": {
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

const NITableRow = ({ item, initialMode }: Props) => {
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

  const NIContext = useContext(NutritionContext);

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
    asyncForEach(itemState.ingredientIds, async (id: any) => {
      const ingredient: NutritionItem = await NutritionItemAPI.READ_BY_ID(id);
      setIngredients([...ingredients, ingredient]);
    });
  }

  async function asyncForEach(array: Array<any>, callback: Function) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  function handleSave() {
    NutritionItemAPI.UPDATE_BY_ID(itemState).then(() => NIContext.refresh());
    setMode(NutritionItemModes.Show);
  }

  function handleCancel() {
    setMode(NutritionItemModes.Show);
    resetItemState();
  }

  function handleDelete() {
    NutritionItemAPI.DELETE_BY_ID(itemState._id).then(() =>
      NIContext.refresh()
    );
  }

  function handleCreate() {
    NutritionItemAPI.CREATE(itemState).then(() => NIContext.refresh());
  }

  function handleReset() {
    resetItemState();
  }

  function commitAddIngredients(ids: string[]) {
    const newNI = NILogic.LocalOperations.add_ingredients(itemState, ids);
    NutritionItemAPI.UPDATE_BY_ID(newNI).then(() => NIContext.refresh());
  }

  return (
    <tr className={classes.outerWrapper}>
      <td>
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
      </td>
      <td>
        <div className={classes.innerWrapper}>
          <div className={classes.info}>
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
      </td>
      <td>
        <Ingredients
          activeIngredientIds={itemState.ingredientIds}
          onAdd={commitAddIngredients}
          onRemove={(id: NutritionItem["_id"]) =>
            setItemState(
              NILogic.LocalOperations.remove_ingredient(itemState, id)
            )
          }
        />
      </td>
      <td>
        {mode !== NutritionItemModes.New && (
          <button onClick={() => handleDelete()}>delete</button>
        )}
      </td>
    </tr>
  );
};

export default NITableRow;
