import React, { useState, useEffect } from "react";
// import {useState} from 'react';
import { NutritionItem, NIgetAll } from "../logic/nutrition/NutritionLogic";
import useFormState from "../common/useFormState";
import NutritionListItem, { NutritionItemModes } from "./NutritionListItem";

const NutritionList = () => {
  const [allNutritionFromBack, setAllNutritionFromBack]: [
    NutritionItem[],
    Function
  ] = useState([]);

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

  return (
    <ul>
      {allNutritionFromBack.map((nutritionItem) => (
        <NutritionListItem
          key={nutritionItem._id}
          item={nutritionItem}
          initialMode={NutritionItemModes.Show}
          refresh={getAllNutrition}
        />
      ))}
      <NutritionListItem
        item={new NutritionItem("")}
        initialMode={NutritionItemModes.New}
        refresh={getAllNutrition}
      />
    </ul>
  );
};

export default NutritionList;
