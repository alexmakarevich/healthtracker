import React, { ReactNode, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import { useEventContext } from "../../../context/EventContextProvider";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import {
  Row,
  Columns,
  UseCustomTableProps,
  useCustomTable,
} from "../../../hooks/useCustomTable";
import {
  exerciseInstanceDefaults,
  ExerciseInstanceDAO,
} from "../../../logic/exerciseInstanceLogic";
import { ItemModes } from "../../../utils/utils";
import { ExerciseInstanceFields } from "../../Exercises/ExerciseInstance/ExerciseInstanceFields";
import { Button } from "../buttons/Button";
import { Icon, IconSizes } from "../styling/Icon";
import { FlexRow } from "./FlexRow";

// TODO: cleanup style
const useStyles = createUseStyles(
  {
    table: {
      borderCollapse: "collapse",
      borderSpacing: "unset",
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

    dateTh: {
      width: 220,
    },
  },

  { name: "ExerciseEventTable" }
);

interface TableProps<
  DataType,
  KeyofDataType extends keyof DataType,
  RowWrapperProps
> extends UseCustomTableProps<DataType, KeyofDataType, RowWrapperProps> {
  RowWrapper?: <Props extends { children: ReactNode } & RowWrapperProps>(
    props: Props
  ) => JSX.Element;
}

export const Table = <
  DataType,
  KeyofDataType extends keyof DataType,
  RowWrapperProps
>({
  data,
  columnKeys,
  columns,
  firstRow,
  lastRow,
  RowWrapper,
}: TableProps<DataType, KeyofDataType, RowWrapperProps>) => {
  const classes = useStyles();

  // TODO: maybe return this from single generator, together with useTable - can save on boilerplate typing like that. and/or extract interface for sort settings
  const [sortSettings, setSortSettings] = useState<
    UseCustomTableProps<DataType, KeyofDataType, RowWrapperProps>["sort"]
  >({ by: columnKeys[0], isAscending: true });

  const { headerCellProps, rowAndCellProps, sort } = useCustomTable({
    data,
    firstRow,
    lastRow,
    columns,
    columnKeys,
    sort: sortSettings,
  });

  const handleSortClick = (
    columnKey: KeyofDataType,
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
                <th {...otherProps} className={classes.th}>
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
            <tr {...row.rowProps} className={classes.tr}>
              {row.rowWrapperProps ? (
                RowWrapper ? (
                  <RowWrapper {...row.rowWrapperProps}>
                    {row.cellProps.map((cellProps) => (
                      <td {...cellProps} className={classes.td} />
                    ))}
                  </RowWrapper>
                ) : (
                  row.cellProps.map((cellProps) => (
                    <td {...cellProps} className={classes.td} />
                  ))
                )
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
