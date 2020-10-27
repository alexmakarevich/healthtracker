import React, { createContext, useContext } from "react";
// import {useState} from 'react';
import { nutritionItemDefaults } from "../../logic/nutritionItemLogic";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import NITableRow from "./NITableRow";
import { ItemModes } from "../../utils/utils";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritionList" });

const NutritionItemTable = () => {
  const NIContext = useNutritionItemContext();

  const classes = useStyles();

  return (
    <>
      <h2>Nutrition Item Table</h2>
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
              initialMode={ItemModes.QuickEdit}
            />
          ))}
          <NITableRow
            item={nutritionItemDefaults}
            initialMode={ItemModes.New}
          />
        </tbody>
      </table>
    </>
  );
};

export default NutritionItemTable;
