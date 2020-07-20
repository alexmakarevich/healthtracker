import React, { useEffect } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NIcreate,
  NIreadById,
  NIdeleteById,
  NIupdateById,
} from "../logic/nutrition/NutritionLogic";
import useObjectState from "../common/useObjectState";
import TextWithEdit from "./generic/TextWithEdit";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    background: "#84b0d9",
    borderRadius: "5px",
    margin: "5px",
    padding: "5px 7px",
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
  refresh?: () => void;
}

const NutritionItemCompact = ({ item, initialMode, refresh }: Props) => {
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

  const [mode, setMode] = useState(initialMode);

  const classes = useStyles();

  function handleSave() {
    NIupdateById(itemState).then(refresh);
    setMode(NutritionItemModes.Show);
  }

  function handleCancel() {
    setMode(NutritionItemModes.Show);
    resetItemState();
  }

  function handleDelete() {
    NIdeleteById(itemState._id).then(refresh);
  }

  function handleCreate() {
    NIcreate(itemState).then(refresh);
  }

  function handleReset() {
    resetItemState();
  }

  return (
    <div className={classes.wrapper}>
      <TextWithEdit
        text={item.title}
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
      {/* {mode === NutritionItemModes.Show && (
        <div>
          <button onClick={() => setMode(NutritionItemModes.Edit)}>edit</button>
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
      )} */}
    </div>
  );
};

export default NutritionItemCompact;
