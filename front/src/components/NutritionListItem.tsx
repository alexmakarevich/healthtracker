import React from "react";
import { useState } from "react";
import {
  NutritionItem,
  useNutritionCRUD,
} from "../logic/nutrition/NutritionLogic";
import useFormState from "../common/useFormState";
import useObjectState from "../common/useObjectState";
import TextWithEdit from "./TextWithEdit";

import axios from "axios";

interface Props {
  item: NutritionItem;
  U: Function;
  D: Function;
}

const NutritionListItem = ({ item, U, D }: Props) => {
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
  const {
    nutrition,
    createNutrition,
    readNutrition,
    updateNutrition,
    deleteNutrition,
  }: {
    nutrition: NutritionItem[];
    createNutrition: Function;
    readNutrition: Function;
    updateNutrition: Function;
    deleteNutrition: Function;
  } = useNutritionCRUD();

  const itemState: NutritionItem = obj;

  function handleTextChange(propName: string, newValue: any) {
    updateProperty(propName, newValue);
  }

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  function handleSave() {
    console.log("handle save");
    U(itemState);
    setIsEditing(!isEditing);
  }

  function handleCancel() {
    resetObj();
    setIsEditing(!isEditing);
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
          <button onClick={() => D(itemState)}>delete</button>
        </div>
      )}
    </div>
  );
};

export default NutritionListItem;
