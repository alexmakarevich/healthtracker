import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { NutritionItem, NILogic } from "../../logic/nutrition/NutritionLogic";
import useObjectState from "../../common/useObjectState";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { NutritionContext } from "../../context/NIContext";
import Ingredients from "./Ingredients";
import Dummy from "../generic/Dummy";

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
    obj: NIState,
    setObj: setNIState,
    updateProperty: updateNIProperty,
    resetObj: resetItemState,
  } = useObjectState(item);

  const classes = useStyles();
  const NIContext = useContext(NutritionContext);
  const [mode, setMode] = useState(initialMode);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    console.log("NITR useEffect called");
    resetItemState();
  }, [item]);

  function handleSave() {
    NIContext.update(NIState);
    setMode(NutritionItemModes.Show);
  }

  function handleCancel() {
    setMode(NutritionItemModes.Show);
    resetItemState();
  }

  async function handleCreate() {
    NIContext.create(NIState);
    handleReset();
  }

  function handleReset() {
    resetItemState();
  }

  function addIngredient(id: string) {
    if (mode === NutritionItemModes.Edit || mode === NutritionItemModes.Show) {
      // NIContext.update(NILogic.LocalOperations.add_ingredient(NIState, id))
      console.log("mode is edit or show, add ingredient: " + id);
      const newNI = NILogic.LocalOperations.add_ingredient(NIState, id);
      console.log("row newNI: ");
      console.log(newNI);
      NIContext.update(newNI);
      // console.log("row newNI: " + newNi)
    }
  }

  function removeIngredient(id: string) {
    if (mode === NutritionItemModes.Edit || mode === NutritionItemModes.Show) {
      // NIContext.update(NILogic.LocalOperations.add_ingredient(NIState, id))
      console.log("mode is edit or show, remove ingredient: " + id);
      const newNI = NILogic.LocalOperations.remove_ingredient(NIState, id);
      console.log("row newNI: ");
      console.log(newNI);
      NIContext.update(newNI);
      // console.log("row newNI: " + newNi)
    }
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
              text={NIState.title}
              className={classes.title}
              isEdit={
                mode === NutritionItemModes.Edit ||
                mode === NutritionItemModes.New
              }
              handleChange={(newText: string) => {
                updateNIProperty("title", newText);
              }}
              onEnter={
                (mode === NutritionItemModes.New && (() => handleCreate())) ||
                (mode === NutritionItemModes.Edit && (() => handleSave())) ||
                (() => console.log("on enter not available for this mode"))
              }
            />
          </div>
        </div>
      </td>
      <td>
        <Ingredients
          parent={NIState}
          onAdd={(id) => addIngredient(id)}
          onRemove={(id) => removeIngredient(id)}
        />
      </td>
      <td>
        {mode !== NutritionItemModes.New && (
          <button onClick={() => NIContext.delete(NIState._id)}>delete</button>
        )}
      </td>
    </tr>
  );
};

export default NITableRow;
