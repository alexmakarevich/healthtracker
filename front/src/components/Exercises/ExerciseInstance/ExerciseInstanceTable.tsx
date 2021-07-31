import React, { useMemo } from "react";
import { useEventContext } from "../../../context/EventContextProvider";
import { ItemModes } from "../../../utils/utils";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
import { Columns, Row } from "../../../hooks/useCustomTable";
import { ExerciseInstanceData, exerciseInstanceDefaults } from "shared";
import { ExerciseInstanceFields } from "./ExerciseInstanceFields";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import { Table } from "../../generic/layout/Table";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    exercise: {
      padding: [0, 2],
    },

    tableInput: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "2px transparent solid",
      "&:hover": {
        borderBottom: "2px #444 solid",
      },
      "&:active": {
        borderBottom: "2px #000 solid",
      },
    },
  },

  { name: "ExerciseEventTable" }
);

export const ExerciseInstanceTable = ({
  className,
}: {
  className?: string;
}) => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();
  const exercises = useExerciseContext();
  const classes = useStyles();

  interface ExerciseEventTableData {
    event: string;
    exercise: string;
    reps: number;
    weight: number;
    duration: number;
    delete: undefined;
  }

  const newItem = { ...exerciseInstanceDefaults };

  const dataAndNew: {
    item: ExerciseInstanceData;
    initialMode: ItemModes;
  }[] = (exerciseInstances.all ?? []).map((i) => ({
    item: i,
    initialMode: ItemModes.QuickEdit,
  }));

  const tableData: Row<
    ExerciseEventTableData,
    {
      item: ExerciseInstanceData;
      initialMode: ItemModes;
    }
  >[] = dataAndNew.map((datum) => {
    const { item, initialMode } = datum;
    return {
      cellData: {
        event: { data: events.getOneFromContext(item.eventId)?.time ?? "" },
        exercise: {
          data: exercises.getOneFromContext(item.exerciseId)?.title ?? "",
        },
        duration: { data: item.durationSeconds ?? 0 },
        reps: { data: item.repetitions ?? 0 },
        weight: { data: item.weightKg ?? 0 },
        delete: { data: undefined },
      },
      rowWrapperProps: { item, initialMode },
      key: item._id,
    };
  });

  const newRow: Row<
    ExerciseEventTableData,
    {
      item: ExerciseInstanceData;
      initialMode: ItemModes;
    }
  > = {
    cellData: {
      event: { data: events.getOneFromContext(newItem.eventId)?.time ?? "" },
      exercise: {
        data: exercises.getOneFromContext(newItem.exerciseId)?.title ?? "",
      },
      duration: { data: newItem.durationSeconds ?? 0 },
      reps: { data: newItem.repetitions ?? 0 },
      weight: { data: newItem.weightKg ?? 0 },
      delete: { data: undefined },
    },
    rowWrapperProps: { item: newItem, initialMode: ItemModes.New },
    key: newItem._id,
  };

  const columns: Columns<ExerciseEventTableData> = useMemo(
    () => ({
      event: {
        title: "time",
        renderFn: () => (
          <>
            <ExerciseInstanceFields.Event className={classes.tableInput} />
            <ExerciseInstanceFields.Buttons />
          </>
        ),
        tdProps: { style: { paddingRight: "0.5em" } },
      },
      exercise: {
        title: "exercise",
        renderFn: () => (
          <ExerciseInstanceFields.Exercise className={classes.exercise} />
        ),
        tdProps: { style: { maxWidth: 200 } },
      },
      reps: {
        title: "reps",
        renderFn: () => (
          <ExerciseInstanceFields.Repetitions className={classes.tableInput} />
        ),
      },
      weight: {
        title: "weight",
        renderFn: () => (
          <ExerciseInstanceFields.Weight className={classes.tableInput} />
        ),
      },
      duration: {
        title: "duration",
        renderFn: () => (
          <ExerciseInstanceFields.Duration className={classes.tableInput} />
        ),
      },
      delete: {
        title: "",
        renderFn: () => <ExerciseInstanceFields.Delete />,
      },
    }),
    [classes.exercise, classes.tableInput]
  );

  const props = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: [
      "event",
      "exercise",
      "reps",
      "weight",
      "duration",
      "delete",
    ] as (keyof ExerciseEventTableData)[],
  };

  return (
    <Table
      {...props}
      columnKeys={["event", "exercise", "reps", "weight", "duration", "delete"]}
      RowWrapper={ExerciseInstanceFields.Wrapper}
      className={className}
    />
  );
};
