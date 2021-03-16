import React, { useMemo, useState } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event } from "../../logic/eventLogic";
import { classConcat, ItemModes } from "../../utils/utils";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import {
  Columns,
  Row,
  useCustomTable,
  UseCustomTableProps,
} from "../../hooks/useCustomTable";
import {
  ExerciseInstanceDAO,
  exerciseInstanceDefaults,
} from "../../logic/exerciseInstanceLogic";
import { ExerciseInstanceFields } from "../Exercises/ExerciseInstance/ExerciseInstanceFields";
import { FlexRow } from "../generic/layout/FlexRow";
import { v4 as uuid } from "uuid";
import { ExerciseFields } from "../Exercises/ExerciseFields";
import { createUseStyles } from "react-jss";
import { Button } from "../generic/buttons/Button";
import { Icon, IconSizes } from "../generic/styling/Icon";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { Table } from "../generic/layout/Table";

// TODO: cleanup style
const useStyles = createUseStyles(
  {
    table: {
      borderCollapse: "collapse",
      borderSpacing: "unset",
    },
    exercise: {
      padding: [0, 5],
      // maxWidth: 150,
    },
    th: {
      padding: 2,
      margin: 0,
    },
    thButton: {
      width: "100%",
      justifyContent: "space-between",
      "& > h3": {
        margin: 0,
        padding: 0,
      },
      background: "#333",
      color: "#ddd",
      "&:hover": {
        color: "white",
      },
    },
    td: {
      position: "relative",
      "& > div": {
        padding: [5, 0],
      },
    },
    tr: {
      background: "#f0f0f0",
      minHeight: "4em",

      "&:nth-child(odd)": {
        background: "#ddd",
      },
      "&:nth-child(even)": {
        background: "#f0f0f0",
      },
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
    dateTh: {
      width: 220,
    },
  },

  { name: "ExerciseEventTable" }
);

export const ExerciseEventTableNew = () => {
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
        event: { data: item.eventId },
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
        title: "event",
        renderFn: () => (
          <FlexRow style={{ justifyContent: "center" }}>
            <ExerciseInstanceFields.Buttons />
            <ExerciseInstanceFields.Event className={classes.tableInput} />
          </FlexRow>
        ),
        tdProps: { style: { minWidth: 200 } },
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
        title: "length",
        renderFn: () => (
          <ExerciseInstanceFields.Duration className={classes.tableInput} />
        ),
      },
      delete: {
        title: "",
        renderFn: () => <ExerciseInstanceFields.Delete />,
      },
    }),
    []
  );

  // TODO: maybe return this from single generator, together with useTable - can save on boilerplate typing like that. and/or extract interface for sort settings
  const [sortSettings, setSortSettings] = useState<
    UseCustomTableProps<
      ExerciseEventTableData,
      keyof ExerciseEventTableData,
      // TODO: allow skipping the third param?
      any
    >["sort"]
  >({ by: "event", isAscending: true });

  const { headerCellProps, rowAndCellProps, columnKeys, sort } = useCustomTable(
    {
      data: tableData.slice(0, -1),
      lastRow: tableData.slice(-1)[0],
      columns,
      columnKeys: ["event", "exercise", "reps", "weight", "duration", "delete"],
      sort: sortSettings,
    }
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
    sort: sortSettings,
  };

  const handleSortClick = (
    columnKey: keyof ExerciseEventTableData,
    isSorted: boolean,
    isAscending: boolean
  ) => {
    const newSettings =
      isSorted && !isAscending
        ? undefined
        : { by: columnKey, isAscending: !isAscending };

    setSortSettings(newSettings);
  };

  return (
    <Table
      {...props}
      columnKeys={["event", "exercise", "reps", "weight", "duration", "delete"]}
      RowWrapper={ExerciseInstanceFields.Wrapper}
    />
  );
};
