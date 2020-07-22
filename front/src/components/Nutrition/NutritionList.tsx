import React, { useState, useEffect, createContext, useContext } from "react";
// import {useState} from 'react';
import { NutritionItem } from "../../logic/nutrition/NutritionLogic";
import useFormState from "../../common/useFormState";
import NutritionListItem, { NutritionItemModes } from "./NutritionListItem";
import { createUseStyles } from "react-jss";
import { NutritionContext } from "../../App";
import { Collapsible } from "./../generic/Collapsible";
import Removable from "./../generic/Removable";

export const TestContext = createContext("test context value");

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "flex-start",
    flexFlow: "column wrap",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritionList" });

// useState below purely for testing purposes

const NutritionList = () => {
  const {
    items: allNutritionItems,
    getOneById: getNutriitionItemByIdFromContext,
    refresh: updateAllNutritionItems,
  } = useContext(NutritionContext);

  const classes = useStyles();
  const [expandList, setExpandList] = useState(false);

  return (
    <ul className={classes.list}>
      {allNutritionItems.map((nutritionItem) => (
        <NutritionListItem
          key={nutritionItem._id}
          item={nutritionItem}
          initialMode={NutritionItemModes.Show}
        />
      ))}
      <NutritionListItem
        item={new NutritionItem("")}
        initialMode={NutritionItemModes.New}
      />
    </ul>
  );
};

export default NutritionList;
