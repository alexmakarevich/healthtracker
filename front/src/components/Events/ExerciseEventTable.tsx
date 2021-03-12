import React, { ReactNode, useContext, useState } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { EventFields } from "./EventFields";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import {
  CellData,
  Columns,
  Row,
  useCustomTable,
  UseCustomTableProps,
} from "../../hooks/useCustomTable";
import { sort } from "d3";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseInstanceDAO } from "../../logic/exerciseInstanceLogic";
import { ExerciseInstanceFields } from "../Exercises/ExerciseInstance/ExerciseInstanceFields";

const ExerciseEventTable = () => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();
  const exercises = useExerciseContext();

  function writeEventIdsToExerciseInstances(
    events: Event[],
    ei: ExerciseInstanceDAO[]
  ) {
    for (const event of events) {
      if (event.children.exerciseInstanceIds.length > 0) {
        for (const eiId of event.children.exerciseInstanceIds) {
          const exerciseInstance = exerciseInstances.getOneFromContext(eiId);
          exerciseInstance &&
            exerciseInstances.update({
              ...exerciseInstance,
              eventId: event._id,
            });
        }
      }
    }
  }

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

  // TODO: remove slice
  const tableData: Row<
    ExerciseEventTableData,
    ExerciseInstanceDAO
  >[] = !exerciseInstances.all
    ? []
    : exerciseInstances.all.map((e) => ({
        cellData: {
          event: { data: e._id },
          exercise: { data: e.exerciseId[0] },
          eventIdInExercise: {
            data: e.eventId,
          },
          duration: { data: e.durationSeconds ?? 0 },
          reps: { data: e.repetitions ?? 0 },
          weight: { data: e.weightKg ?? 0 },
        },
        // rowWrapper: ({ children }: { children: ReactNode }) => (
        //   <div>
        //     posos {children} {e.time}
        //     {" pisos"}
        //   </div>
        // ),
        rowWrapperProps: e,
        // data: e,
      }));

  const columns: Columns<ExerciseEventTableData> = {
    event: {
      title: "event",
      renderFn: () => <ExerciseInstanceFields.Event />,
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
      ExerciseInstanceDAO
    >["sort"]
  >({ by: "event", isAscending: true });

  const { headerCellProps, rowAndCellProps, columnKeys, sort } = useCustomTable(
    {
      data: tableData,
      columns,
      columnKeys: ["event", "exercise", "reps", "weight", "duration"],
      sort: sortSettings,
      rowWrapperFn: (props: ExerciseInstanceDAO) => ({
        children,
      }: {
        children: React.ReactNode;
      }) => (
        <ExerciseInstanceFields.Wrapper
          item={props}
          initialMode={ItemModes.QuickEdit}
        >
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

      <button
        onClick={() =>
          writeEventIdsToExerciseInstances(
            events.all ?? [],
            exerciseInstances.all ?? []
          )
        }
      >
        add event ids to exercise instances
      </button>
    </div>
  );
};

export { ExerciseEventTable };
