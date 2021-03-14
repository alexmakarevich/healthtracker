import React, { useMemo, useState } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
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
    thButton: {
      width: "100%",
      justifyContent: "space-between",
      "& > h3": {
        margin: 0,
        padding: 0,
      },
    },
    td: {
      position: "relative",
    },
    tableInput: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  },

  { name: "ExerciseEventTable" }
);

const ExerciseEventTable = () => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();
  const classes = useStyles();

  // writeEventIdsToExerciseInstances(
  //   eventsFromContext.all ?? [],
  //   exerciseInstanceContext.all ?? []
  // );

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

  console.log({ data: exerciseInstances.all, dataAndNew });

  // TODO: remove slice
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
        exercise: { data: item.exerciseId[0] },
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

  // BUG: number inputs switch focus on every input (from up arrow to down arrow, if pressing arrows on keyboard, starts scrolling page, as happened before sometimes)

  const columns: Columns<ExerciseEventTableData> = useMemo(
    () => ({
      event: {
        title: "event",
        renderFn: () => (
          <FlexRow style={{ justifyContent: "center" }}>
            <ExerciseInstanceFields.Buttons />
            <ExerciseInstanceFields.Event />
          </FlexRow>
        ),
      },
      exercise: {
        title: "exercise",
        renderFn: () => (
          <ExerciseInstanceFields.Exercise className={classes.exercise} />
        ),
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
    <div>
      <table className={classes.table}>
        <thead>
          <tr>
            {headerCellProps.map((props, index) => {
              const { children, ...otherProps } = props;
              const isColumnSorted =
                !!sort &&
                index === columnKeys.findIndex((key) => key === sort.by);
              const isColumnSortedAscending = !!sort?.isAscending;

              return (
                <th {...otherProps}>
                  {children && (
                    <Button
                      onClick={() =>
                        handleSortClick(
                          columnKeys[index],
                          isColumnSorted,
                          isColumnSortedAscending
                        )
                      }
                      className={classes.thButton}
                    >
                      <h3>{children}</h3>
                      {isColumnSorted ? (
                        isColumnSortedAscending ? (
                          <Icon icon={"arrowDown"} size={IconSizes.S} />
                        ) : (
                          <Icon icon={"arrowUp"} size={IconSizes.S} />
                        )
                      ) : (
                        <Icon icon={"empty"} size={IconSizes.S} />
                      )}
                    </Button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rowAndCellProps.map((row) => (
            <tr {...row.rowProps}>
              {row.rowWrapperProps ? (
                <ExerciseInstanceFields.Wrapper {...row.rowWrapperProps}>
                  {row.cellProps.map((cellProps) => (
                    <td {...cellProps} className={classes.td} />
                  ))}
                </ExerciseInstanceFields.Wrapper>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ExerciseEventTable };
