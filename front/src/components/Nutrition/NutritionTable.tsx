import React, { useState, useEffect, createContext, useContext } from "react";
// import {useState} from 'react';
import { NutritionItem } from "../../logic/nutrition/NutritionLogic";
import useFormState from "../../common/useFormState";
import NutritionListItem, { NutritionItemModes } from "./NutritionListItem";
import { createUseStyles } from "react-jss";
import { NutritionContext } from "../../App";
import Collapsible from "../generic/Collapsible";
import Removable from "../generic/Removable";
import NITableRow from "./NITableRow";

export const TestContext = createContext("test context value");

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritionList" });

// useState below purely for testing purposes

const NutritionTable = () => {
  const NIContext = useContext(NutritionContext);

  const classes = useStyles();
  const [expandList, setExpandList] = useState(false);

  console.log("all NI in table: ");
  console.log(NIContext.items);

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Ingredients</th>
        </tr>
      </thead>
      <tbody className={classes.list}>
        {NIContext.items.map((nutritionItem) => (
          <NITableRow
            key={nutritionItem._id}
            item={nutritionItem}
            initialMode={NutritionItemModes.Show}
          />
        ))}
        <NITableRow
          item={new NutritionItem("")}
          initialMode={NutritionItemModes.New}
        />
      </tbody>
    </table>
  );
};

export default NutritionTable;
