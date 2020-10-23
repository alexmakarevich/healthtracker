import React, { createContext, useContext } from "react";
import { createUseStyles } from "react-jss";
import { ExerciseRepsContext } from "../../../context/ExerciseRepsContextProvider";
import { exerciseRepsDefaults } from "../../../logic/exerciseRepsLogic";
import { ItemModes } from "../../../utils/utils";
import { SimpleRow } from "../../generic/layout/SimpleRow";
import { ExerciseRepsRow } from "./ExerciseRepsRow";
import {
  ExerciseRepsFieldProps,
  useExerciseRepsFields,
} from "./useExerciseRepsFilelds";
// import {useState} from 'react';

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritionList" });

const ExerciseRepsTable = () => {
  const exerciseReps = useContext(ExerciseRepsContext);

  const classes = useStyles();

  return (
    <>
      <h2>Exercise Reps Table</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={classes.list}>
          {exerciseReps.all.map((exercise) => (
            <Row
              key={exercise._id}
              item={exercise}
              initialMode={ItemModes.QuickEdit}
            />
          ))}
          <Row item={exerciseRepsDefaults} initialMode={ItemModes.New} />
        </tbody>
      </table>
    </>
  );
};

const Row = (props: ExerciseRepsFieldProps) => {
  const { Buttons, Delete, Repetitions } = useExerciseRepsFields(props);

  return (
    <SimpleRow>
      <Buttons />
      <Repetitions />
      <Delete />
    </SimpleRow>
  );
};

export { ExerciseRepsTable };
