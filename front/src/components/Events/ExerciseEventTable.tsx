import React, { useState } from "react";
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
    };
  });

  const columns: Columns<ExerciseEventTableData> = {
    event: {
      title: "event",
      renderFn: () => (
        <>
          <ExerciseInstanceFields.Buttons />
          <ExerciseInstanceFields.Event />
        </>
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
  };

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
      rowWrapperFn: (props: {
        item: ExerciseInstanceDAO;
        initialMode: ItemModes;
      }) => ({ children }: { children: React.ReactNode }) => (
        <ExerciseInstanceFields.Wrapper {...props}>
          {children}
        </ExerciseInstanceFields.Wrapper>
      ),
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
    // console.log({ newSettings });

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
              {row.rowWrapper ? (
                <row.rowWrapper>
                  {row.cellProps.map((cellProps) => (
                    <td {...cellProps} />
                  ))}
                </row.rowWrapper>
              ) : (
                row.cellProps.map((cellProps) => <td {...cellProps} />)
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ExerciseEventTable };
