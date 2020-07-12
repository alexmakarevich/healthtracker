import React from "react";
import { useState } from "react";
import {
  NutritionItem,
  NIcreate,
  NIgetById,
  NIdeleteById,
  NIupdateById,
} from "../logic/nutrition/NutritionLogic";
import useFormState from "../common/useFormState";
import useObjectState from "../common/useObjectState";
import TextWithEdit from "./TextWithEdit";

interface Props {
  item: NutritionItem;
  refresh: () => void;
}

const NutritionListItem = ({ item, refresh }: Props) => {
  const {
    obj,
    updateProperty,
    resetObj,
  }: {
    obj: NutritionItem;
    updateProperty: any;
    resetObj: any;
  } = useObjectState(item);
  const [isEditing, setIsEditing] = useState(false);

  const itemState: NutritionItem = obj;

  function handleTextChange(propName: string, newValue: any) {
    updateProperty(propName, newValue);
  }

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  function handleSave() {
    NIupdateById(itemState._id, itemState);
    setIsEditing(!isEditing);
  }

  function handleCancel() {
    resetObj();
    setIsEditing(!isEditing);
  }

  function handleDelete() {
    NIdeleteById(itemState._id).then(() => refresh());
  }

  return (
    <div>
      <TextWithEdit
        text={itemState.title}
        isEdit={!isEditing}
        handleChange={(newText: string) => {
          handleTextChange("title", newText);
        }}
      />
      {isEditing ? (
        <div>
          <button onClick={() => handleSave()}>save</button>
          <button onClick={() => handleCancel()}>cancel</button>
        </div>
      ) : (
        <div>
          <button onClick={toggleEdit}>edit</button>
          <button onClick={() => handleDelete()}>delete</button>
        </div>
      )}
    </div>
  );
};

export default NutritionListItem;
