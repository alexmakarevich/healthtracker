import React, { useState, useEffect, createContext } from "react";
// import {useState} from 'react';
import { NutritionItem, NIreadAll } from "../logic/nutrition/NutritionLogic";
import useFormState from "../common/useFormState";
import NutritionListItem, { NutritionItemModes } from "./NutritionListItem";
import { createUseStyles } from "react-jss";

export const TestContext = createContext("test context value");

const useStyles = createUseStyles({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    width: "fit-content",
    borderRadius: "15px",
    display: "flex",
    flexFlow: "column nowrap",
  },
});

const NutritionList = () => {
  const [allNutritionFromBack, setAllNutritionFromBack]: [
    NutritionItem[],
    Function
  ] = useState([]);

  useEffect(() => {
    console.log("useEffect getAllNutrition called");
    getAllNutrition();
  }, []);

  const classes = useStyles();

  async function getAllNutrition() {
    console.log("getAllNutrition called");

    const allNutr: NutritionItem[] = await NIreadAll();
    setAllNutritionFromBack(allNutr);
    // return allNutr;
  }

  return (
    <ul className={classes.list}>
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
