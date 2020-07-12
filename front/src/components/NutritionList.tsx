import React, { useState, useEffect } from "react";
// import {useState} from 'react';
import {
  NutritionItem,
  NIcreate,
  NIgetById,
  NIgetAll,
  NIdeleteById,
  NIupdateById,
} from "../logic/nutrition/NutritionLogic";
import useFormState from "../common/useFormState";
import NutritionListItem from "./NutritionListItem";

const NutritionList = () => {
  const [allNutritionFromBack, setAllNutritionFromBack]: [
    NutritionItem[],
    Function
  ] = useState([]);

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

  useEffect(() => {
    console.log("useEffect getAllNutrition called");
    getAllNutrition();
  }, []);

  async function getAllNutrition() {
    console.log("getAllNutrition called");

    const allNutr: NutritionItem[] = await NIgetAll();
    setAllNutritionFromBack(allNutr);
    // return allNutr;
  }

  function handleTitleChange(title: string) {
    updateProperty("title", title);
  }

  function handleItemUpdate(nutritionItem: NutritionItem) {
    NIupdateById(nutritionItem._id, nutritionItem).then(() =>
      getAllNutrition()
    );
  }

  async function handleItemDelete(nutritionItem: NutritionItem) {
    // deleteNutrition(nutritionItem);
    NIdeleteById(nutritionItem._id).then(() => getAllNutrition());
  }

  async function sendCreateRequest() {
    NIcreate(formObject).then(() => getAllNutrition());
    resetForm();
  }

  return (
    <ul>
      {allNutritionFromBack.map((nutritionItem) => (
        <NutritionListItem
          key={nutritionItem._id}
          item={nutritionItem}
          refresh={getAllNutrition}
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
            sendCreateRequest();
          }}
        >
          create
        </button>
      </li>
    </ul>
  );
};

export default NutritionList;
