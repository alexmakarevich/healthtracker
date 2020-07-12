import React from "react";
import { useState } from "react";
import {
  NutritionItem,
  NIcreate,
  NIgetById,
  NIdeleteById,
  NIupdateById,
} from "../logic/nutrition/NutritionLogic";
import useObjectState from "../common/useObjectState";
import TextWithEdit from "./TextWithEdit";

export enum NutritionItemModes {
  Show,
  Edit,
  New,
}

interface Props {
  item: NutritionItem;
  initialMode: NutritionItemModes;
  refresh: () => void;
}

const NutritionListItem = ({ item, initialMode, refresh }: Props) => {
  const {
    obj: itemState,
    updateProperty: updateItemProperty,
    resetObj: resetItemState,
  }: {
    obj: NutritionItem;
    updateProperty: any;
    resetObj: any;
  } = useObjectState(item);

  const [mode, setMode] = useState(initialMode);

  function handleSave() {
    NIupdateById(itemState._id, itemState).then(refresh);
    setMode(NutritionItemModes.Show);
    resetItemState();
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
    <div>
      <TextWithEdit
        text={itemState.title}
        isEdit={
          mode === NutritionItemModes.Edit || mode === NutritionItemModes.New
        }
        handleChange={(newText: string) => {
          updateItemProperty("title", newText);
        }}
      />
      {mode === NutritionItemModes.Show && (
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
      )}
    </div>
  );
};

export default NutritionListItem;
