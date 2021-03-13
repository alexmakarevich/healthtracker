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

const ExerciseEventTable = () => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();

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
        renderFn: () => <ExerciseInstanceFields.Exercise />,
      },
      reps: {
        title: "reps",
        renderFn: () => <ExerciseInstanceFields.Repetitions />,
      },
      weight: {
        title: "weight",
        renderFn: () => <ExerciseInstanceFields.Weight />,
      },
      duration: {
        title: "duration",
        renderFn: () => <ExerciseInstanceFields.Duration />,
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
      data: tableData,
      columns,
      columnKeys: ["event", "exercise", "reps", "weight", "duration"],
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
      <table>
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
                  <button
                    onClick={() =>
                      handleSortClick(
                        columnKeys[index],
                        isColumnSorted,
                        isColumnSortedAscending
                      )
                    }
                  >
                    {children}
                    {isColumnSorted &&
                      " " + (isColumnSortedAscending ? "<" : ">")}
                  </button>
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
                    <td {...cellProps} />
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
