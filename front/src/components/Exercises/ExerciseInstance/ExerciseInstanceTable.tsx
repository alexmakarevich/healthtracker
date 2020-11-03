import React from "react";
import { createUseStyles } from "react-jss";
import { useExerciseInstanceContextUseQuery } from "../../../context/ExerciseInstanceContextProvider";
import {
  ExerciseInstance,
  exerciseInstanceDefaults,
} from "../../../logic/exerciseInstanceLogic";
import { ItemModes } from "../../../utils/utils";
import { SimpleRow } from "../../generic/layout/SimpleRow";

import { ExerciseInstanceFields } from "./ExerciseInstanceFields";

interface ExerciseInstanceFieldProps {
  item: ExerciseInstance;
  initialMode: ItemModes;
}

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "ExerciseReps" });

const ExerciseInstanceTable = () => {
  const exerciseReps = useExerciseInstanceContextUseQuery();

  const classes = useStyles();

  return (
    <>
      <h2>Exercise Instance Table</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={classes.list}>
          {exerciseReps.all?.map((exercise, index) => (
            <Row
              key={index}
              item={exercise}
              initialMode={ItemModes.QuickEdit}
            />
          ))}
          <Row
            key={"new"}
            item={exerciseInstanceDefaults}
            initialMode={ItemModes.New}
          />
        </tbody>
      </table>
    </>
  );
};

const Row = (props: ExerciseInstanceFieldProps) => {
  return (
    <ExerciseInstanceFields.Wrapper {...props}>
      <SimpleRow>
        <ExerciseInstanceFields.Buttons />
        <ExerciseInstanceFields.Exercise />
        <ExerciseInstanceFields.Repetitions />
        <ExerciseInstanceFields.Weight />
        <ExerciseInstanceFields.Duration />
        <ExerciseInstanceFields.Delete />
      </SimpleRow>
    </ExerciseInstanceFields.Wrapper>
  );
};

export { ExerciseInstanceTable };
