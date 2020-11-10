import React from "react";
import { createUseStyles } from "react-jss";
import {
  ExerciseType,
  exerciseTypeDefaults,
} from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseFields } from "./ExerciseFields";
// import {useState} from 'react';

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

export interface ExerciseTypeFieldProps {
  item: ExerciseType;
  initialMode: ItemModes;
}

const useStyles = createUseStyles(styles, { name: "NutritionList" });

const ExerciseTypeTable = () => {
  const ETContext = useExerciseContext();

  const classes = useStyles();

  return (
    <>
      <h2>Exercise Type Table</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={classes.list}>
          {ETContext.all &&
            ETContext.all.map((exercise: ExerciseType, index: number) => (
              <Row
                item={exercise}
                initialMode={ItemModes.QuickEdit}
                key={index}
              />
            ))}
          <Row item={exerciseTypeDefaults} initialMode={ItemModes.New} />
        </tbody>
      </table>
    </>
  );
};

const Row = (props: ExerciseTypeFieldProps) => {
  return (
    <ExerciseFields.Wrapper item={props.item} initialMode={props.initialMode}>
      <SimpleRow>
        <ExerciseFields.Buttons />
        <ExerciseFields.Title />
        <ExerciseFields.Delete />
      </SimpleRow>
    </ExerciseFields.Wrapper>
  );
};

export default ExerciseTypeTable;
