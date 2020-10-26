import React, { createContext, useContext, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { exerciseTypeDefaults } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import { SimpleRow } from "../generic/layout/SimpleRow";
import {
  ExerciseTypeFieldProps,
  useExerciseTypeProps,
} from "./useExerciseFilelds";
import { ExerciseRow } from "./ExerciseRow";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
// import {useState} from 'react';

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

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
          {ETContext.all.map((exercise, index) => (
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
  console.log("Row", props.item);

  const {
    someNumberProps,
    deleteProps,
    buttonsProps,
    titleProps,
    Exercise,
  } = useExerciseTypeProps(props);

  return (
    <SimpleRow>
      <Exercise.Buttons {...buttonsProps} />
      <Exercise.Title {...titleProps} />
      <Exercise.SomeNumber {...someNumberProps} />
      <Exercise.Delete {...deleteProps} />
    </SimpleRow>
  );
};

export default ExerciseTypeTable;
