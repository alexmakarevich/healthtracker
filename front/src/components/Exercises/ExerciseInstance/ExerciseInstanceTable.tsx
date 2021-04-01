import React, { useMemo, useState } from "react";
import { useEventContext } from "../../../context/EventContextProvider";
import { Event } from "../../../logic/eventLogic";
import { classConcat, ItemModes } from "../../../utils/utils";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
import {
  Columns,
  Row,
  useCustomTable,
  UseCustomTableProps,
} from "../../../hooks/useCustomTable";
import {
  ExerciseInstanceDAO,
  exerciseInstanceDefaults,
} from "../../../logic/exerciseInstanceLogic";
import { ExerciseInstanceFields } from "./ExerciseInstanceFields";
import { FlexRow } from "../../generic/layout/FlexRow";
import { v4 as uuid } from "uuid";
import { ExerciseFields } from "../ExerciseFields";
import { createUseStyles } from "react-jss";
import { Button } from "../../generic/buttons/Button";
import { Icon, IconSizes } from "../../generic/styling/Icon";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import { Table } from "../../generic/layout/Table";

// TODO: cleanup style
const useStyles = createUseStyles(
  {
    exercise: {
      padding: [0, 2],
      // maxWidth: 150,
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
        // boxShadow: "rgba(0, 0, 0, 0.4) 0 0 1px 1px",
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
    item: ExerciseInstanceDAO;
    initialMode: ItemModes;
  }[] = [
    ...(exerciseInstances.all ?? []).map((i) => ({
      item: i,
      initialMode: ItemModes.QuickEdit,
    })),
    { item: newItem, initialMode: ItemModes.New },
  ];

  const tableData: Row<
    ExerciseEventTableData,
    {
      item: ExerciseInstanceDAO;
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
        eventIdInExercise: {
          data: item.eventId,
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

  const columns: Columns<ExerciseEventTableData> = useMemo(
    () => ({
      event: {
        title: "time",
        renderFn: () => (
          <FlexRow style={{ justifyContent: "center" }}>
            <ExerciseInstanceFields.Buttons />
            <ExerciseInstanceFields.Event className={classes.tableInput} />
          </FlexRow>
        ),
        tdProps: { style: { minWidth: 130 } },
        // sortAscendingFn: (a, b) => {
        //   console.log({ a, b });

        //   return new Date(a).valueOf() === new Date(b).valueOf()
        //     ? 0
        //     : new Date(a).valueOf() < new Date(b).valueOf()
        //     ? -1
        //     : 1;
        // },
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
    data: tableData.slice(0, -1),
    lastRow: tableData.slice(-1)[0],
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
