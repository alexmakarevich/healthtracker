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
    eventIdInExercise: string;
    reps: number;
    weight: number;
    duration: number;
  }

  // TODO: remove slice
  const tableData: Row<ExerciseEventTableData, string>[] = !events.all
    ? []
    : [events.all[0] ?? []].map((e) => ({
        cellData: {
          event: { data: e._id },
          exercise: { data: e.children.exerciseInstanceIds[0] },
          eventIdInExercise: {
            data:
              exerciseInstances.getOneFromContext(
                e.children.exerciseInstanceIds[0]
              )?.eventId ?? "none",
          },
          duration: { data: 3 },
          reps: { data: 3 },
          weight: { data: 3 },
        },
        // rowWrapper: ({ children }: { children: ReactNode }) => (
        //   <div>
        //     posos {children} {e.time}
        //     {" pisos"}
        //   </div>
        // ),
        rowWrapperProps: e.time,
        // data: e,
      }));

  const columns: Columns<ExerciseEventTableData> = {
    event: {
      title: "event",
    },
    exercise: {
      title: "exercise",
      renderFn: (exId) =>
        exercises.getOneFromContext(
          exerciseInstances.getOneFromContext(exId)?.exerciseId ?? ""
        )?.title ?? "no exercise",
    },
    eventIdInExercise: {
      title: "eventIdInExercise",
    },
    reps: {
      title: "reps",
    },
    weight: {
      title: "weight",
    },
    duration: {
      title: "duration",
    },
  };

  // TODO: maybe return this from single generator, together with useTable - can save on boilerplate typing like that. and/or extract interface for sort settings
  const [sortSettings, setSortSettings] = useState<
    UseCustomTableProps<
      ExerciseEventTableData,
      keyof ExerciseEventTableData,
      // TODO: skip the third param
      any
    >["sort"]
  >({ by: "event", isAscending: true });

  const { headerCellProps, rowAndCellProps, columnKeys, sort } = useCustomTable(
    {
      data: tableData,
      columns,
      columnKeys: [
        "event",
        "exercise",
        "reps",
        "weight",
        "duration",
        "eventIdInExercise",
      ],
      sort: sortSettings,
      rowWrapperFn: (props: string) => ({
        children,
      }: {
        children: React.ReactNode;
      }) => (
        <div>
          props:
          {props}
          children:
          {children}
          post-children
        </div>
      ),
      // rowWrapper: (data) => ({ children }: { children: React.ReactNode }) => (
      //   <div>
      //     {JSON.stringify(data)}
      //     {children}f
      //   </div>
      // ),
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

  // const newExercise = new ExerciseInstance({
  //   _id: "",
  //   createdOn: "",
  //   eventId: "6017f039d1ed9021049c5940",
  //   exerciseId: "5f9da81170fbbc1e602b620d",
  //   lastModifiedOn: "",
  // });

  // newExercise.create;

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
