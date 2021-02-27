import React, { useContext, useState } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { EventFields } from "./EventFields";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import {
  CellData,
  Columns,
  useCustomTable,
  UseCustomTableProps,
} from "../../hooks/useCustomTable";
import { sort } from "d3";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";

const ExerciseEventTable = () => {
  const eventsFromContext = useEventContext();
  const exerciseInstanceContext = useExerciseInstanceContext();
  const exerciseContext = useExerciseContext();

  // function writeEventIdsToExerciseInstances

  interface ExerciseEventTableData {
    event: string;
    exercise: string;
    reps: number;
    weight: number;
    duration: number;
  }

  const tableData: CellData<ExerciseEventTableData>[] = !eventsFromContext.all
    ? []
    : eventsFromContext.all?.map((e) => ({
        event: { data: e._id },
        exercise: { data: e.children.exerciseInstanceIds[0] },
        duration: { data: 3 },
        reps: { data: 3 },
        weight: { data: 3 },
      }));

  const columns: Columns<ExerciseEventTableData> = {
    event: {
      title: "event",
    },
    exercise: {
      title: "exercise",
      renderFn: (exId) =>
        exerciseContext.getOneFromContext(
          exerciseInstanceContext.getOneFromContext(exId)?.exerciseId ?? ""
        )?.title ??
        "" + exerciseInstanceContext.getOneFromContext(exId)?.eventId ??
        "no event id",
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
      keyof ExerciseEventTableData
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
              {row.cellProps.map((cellProps) => (
                <td {...cellProps} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ExerciseEventTable };
