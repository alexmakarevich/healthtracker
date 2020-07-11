import React from "react";
// import {useState} from 'react';
import {
  NutritionItem,
  useNutritionCRUD,
  NIcreate,
  NIgetById,
} from "../logic/nutrition/NutritionLogic";
import useFormState from "../common/useFormState";
import NutritionListItem from "./NutritionListItem";

const NutritionList = () => {
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

  const {
    formObject,
    updateProperty,
    resetForm,
  }: {
    formObject: NutritionItem;
    updateProperty: Function;
    resetForm: Function;
  } = useFormState({
    id: "temp",
    title: "",
    ingredientIds: [1, 3, 2],
  });

  console.log("nutrition list rendered");

  function handleTitleChange(title: string) {
    updateProperty("title", title);
  }

  function handleCreate() {
    createNutrition(formObject);
    sendCreateRequest();
    resetForm();
  }

  function handleItemUpdate(nutritionItem: NutritionItem) {
    updateNutrition(nutritionItem);
  }

  function handleItemDelete(nutritionItem: NutritionItem) {
    deleteNutrition(nutritionItem);
  }

  function sendCreateRequest() {
    // createNutritionAPI(newNutritionItem)
    // axios.post('http://localhost:4000/nutritionItems/add', newNutritionItem).then(res => console.log(res.data));
    // createNutritionHTTP(formObject);
    // createNutritionAPIFromConst(formObject);
    // generatedCreateNutr(formObject);
    NIcreate({
      id: 1000,
      title: "new",
      ingredientIds: [1, 2, 3],
    });
  }

  return (
    <ul>
      {nutrition.map((nutritionItem) => (
        <NutritionListItem
          key={nutritionItem.id}
          item={nutritionItem}
          U={handleItemUpdate}
          D={handleItemDelete}
        />
      ))}
      <li>
        <input
          value={formObject.title}
          placeholder="title"
          onChange={(event) => handleTitleChange(event.target.value)}
        />
        <button
          onClick={() => {
            handleCreate();
          }}
        >
          create
        </button>
      </li>
    </ul>
  );
};

export default NutritionList;
