import React, { createContext, useContext } from "react";
// import {useState} from 'react';
import {
  NutritionItem,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import { createUseStyles } from "react-jss";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import NITableRow from "./NITableRow";
import { EventContext } from "../../context/EventContextProvider";
import { ItemModes } from "../../utils/utils";

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
  const EventsFromContext = useContext(EventContext);

  const classes = useStyles();

  // console.log("all NI in table: ");
  // console.log(NIContext.all);

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
            initialMode={ItemModes.QuickEdit}
          />
        ))}
        <NITableRow item={nutritionItemDefaults} initialMode={ItemModes.New} />
      </tbody>
    </table>
  );
};

export default NutritionTable;
