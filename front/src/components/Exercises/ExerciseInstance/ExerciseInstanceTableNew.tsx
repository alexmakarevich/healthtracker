import React from "react";
import { createUseStyles } from "react-jss";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
import { Columns, Row } from "../../../hooks/useCustomTable";
import { Event as EventDAO } from "../../../logic/eventLogic";
import {
  ExerciseInstanceDAO,
  exerciseInstanceDefaults,
  useExerciseInstance,
} from "../../../logic/exerciseInstanceLogic";
import { ExerciseType as ExerciseDAO } from "../../../logic/exerciseTypeLogic";
import { ItemModes } from "../../../utils/utils";
import { SimpleRow } from "../../generic/layout/SimpleRow";

import { ExerciseInstanceFields } from "./ExerciseInstanceFields";

interface ExerciseInstanceFieldProps {
  item: ExerciseInstanceDAO;
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

interface EIColumns {
  event: string;
  exercise: string;
  repetitions?: number;
  weight?: number;
  duration?: number;
}

const ExerciseInstanceTableNew = () => {
  const ExceriseInstances = useExerciseInstanceContext();

  console.log({ allExInstances: ExceriseInstances.all });

  // TODO: remove slice - it's only there to reduce the amount of data.
  const dataRows: Row<EIColumns, any>[] =
    ExceriseInstances.all?.slice(0, 1).map((ei) => ({
      cellData: {
        event: { data: ei.eventId },
        exercise: { data: ei.exerciseId },
        duration: { data: ei.durationSeconds },
        weight: { data: ei.weightKg },
        repetitions: { data: ei.repetitions },
      },
      key: ei._id,
    })) ?? [];

  const columns: Columns<EIColumns> = {
    event: { title: "event" },
    exercise: { title: "exercise" },
    duration: { title: "duration" },
    weight: { title: "weight" },
    repetitions: { title: "repetitions" },
  };

  const classes = useStyles();

  return (
    <>
      <h2>{ExerciseInstanceTableNew.name}</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={classes.list}>
          {ExceriseInstances.all?.map((exercise, index) => (
            <Roww
              key={index}
              item={exercise}
              initialMode={ItemModes.QuickEdit}
            />
          ))}
          <Roww
            key={"new"}
            item={exerciseInstanceDefaults}
            initialMode={ItemModes.New}
          />
        </tbody>
      </table>
    </>
  );
};

const Roww = (props: ExerciseInstanceFieldProps) => {
  const EI = useExerciseInstance({
    data: props.item,
    initialMode: props.initialMode,
  });

  return (
    <SimpleRow>
      <td>{EI.event?.time}</td>
      <td>{EI.exercise?.title}</td>
      <td>{EI.data.repetitions}</td>
      <td>{EI.data.weightKg}</td>
      <td>{EI.data.durationSeconds}</td>
    </SimpleRow>
  );
};

export { ExerciseInstanceTableNew };
