import React from "react";
import { createUseStyles } from "react-jss";
import { exerciseTypeDefaults } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { ExerciseTypeFieldProps } from "./useExerciseFilelds";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { Exercise } from "./ExerciseFields";
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

// const Row = (props: ExerciseTypeFieldProps) => {
//   console.log("Row", props.item);

//   const {
//     someNumberProps,
//     deleteProps,
//     buttonsProps,
//     titleProps,
//     Exercise,
//   } = useExerciseTypeProps(props);

//   return (
//     <SimpleRow>
//       <Exercise.Buttons {...buttonsProps} />
//       <Exercise.Title {...titleProps} />
//       <Exercise.SomeNumber {...someNumberProps} />
//       <Exercise.Delete {...deleteProps} />
//     </SimpleRow>
//   );
// };

const Row = (props: ExerciseTypeFieldProps) => {
  return (
    <Exercise.Wrapper item={props.item} initialMode={props.initialMode}>
      <SimpleRow>
        <Exercise.Buttons />
        <Exercise.Title />
        <Exercise.SomeNumber />
        <Exercise.Delete />
      </SimpleRow>
    </Exercise.Wrapper>
  );
};

export default ExerciseTypeTable;
