import React, { createContext, useContext } from "react";
import { createUseStyles } from "react-jss";
import { ExerciseTypeContext } from "../../context/ExerciseTypeContextProvider";
import { exerciseTypeDefaults } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { ExerciseTypeFieldProps, useExerciseFields } from "./ExerciseFilelds";
import { ExerciseRow } from "./ExerciseRow";
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
  const ETContext = useContext(ExerciseTypeContext);

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
          <ExerciseRow
            item={exerciseTypeDefaults}
            initialMode={ItemModes.New}
          />
        </tbody>
      </table>
    </>
  );
};

const Row = (props: ExerciseTypeFieldProps) => {
  const { Title, Buttons, Delete } = useExerciseFields(props);
  const cells = [<Buttons />, <Title />, <Delete />];
  return (
    <tr>
      {cells.map((cell) => (
        <td>{cell}</td>
      ))}
    </tr>
  );
};

export default ExerciseTypeTable;
