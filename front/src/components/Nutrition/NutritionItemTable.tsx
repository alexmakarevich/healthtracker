import React from "react";
// import {useState} from 'react';
import {
  NutritionItem,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import { ItemModes } from "../../utils/utils";
import { NutritionFields } from "./NutritionFields";
import { SimpleRow } from "../generic/layout/SimpleRow";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritionList" });

export const NutritionItemTable = () => {
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
          {NIContext.all?.map((nutritionItem) => (
            <Row
              key={nutritionItem._id}
              item={nutritionItem}
              initialMode={ItemModes.QuickEdit}
            />
          ))}
          <Row item={nutritionItemDefaults} initialMode={ItemModes.New} />
        </tbody>
      </table>
    </>
  );
};

const Row = (props: { item: NutritionItem; initialMode: ItemModes }) => {
  return (
    <NutritionFields.Wrapper item={props.item} initialMode={props.initialMode}>
      <SimpleRow>
        <NutritionFields.Buttons />
        <NutritionFields.Title />
        <NutritionFields.Ingredients />
        <NutritionFields.Delete />
      </SimpleRow>
    </NutritionFields.Wrapper>
  );
};
