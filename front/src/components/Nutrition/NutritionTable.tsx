import React, { createContext, useContext } from "react";
// import {useState} from 'react';
import {
  NutritionItem,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import { NutritionItemModes } from "./NITableRow";
import { createUseStyles } from "react-jss";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import NITableRow from "./NITableRow";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritionList" });

const NutritionTable = () => {
  const NIContext = useContext(NutritionItemContext);

  const classes = useStyles();

  console.log("all NI in table: ");
  console.log(NIContext.all);

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
        {NIContext.all.map((nutritionItem) => (
          <NITableRow
            key={nutritionItem._id}
            item={nutritionItem}
            initialMode={NutritionItemModes.Show}
          />
        ))}
        <NITableRow
          item={nutritionItemDefaults}
          initialMode={NutritionItemModes.New}
        />
      </tbody>
    </table>
  );
};

export default NutritionTable;
