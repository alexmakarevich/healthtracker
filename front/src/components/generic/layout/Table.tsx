import React, { ReactNode, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  UseCustomTableProps,
  useCustomTable,
} from "../../../hooks/useCustomTable";

import { Theme } from "../../../styling/theme";
import { classConcat } from "../../../utils/utils";
import { Button } from "../buttons/Button";
import { Icon, IconSizes } from "../styling/Icon";

// TODO: cleanup style
const useStyles = createUseStyles(
  (theme: Theme) => ({
    table: {
      borderCollapse: "collapse",
      borderSpacing: "unset",
    },

    th: {
      padding: ["0.5em", "0.125em"],
    },
    thButton: {
      width: "100%",
      justifyContent: "space-between",
      "& > h3": {
        margin: 0,
        padding: 0,
      },
      background: theme.textMain,
      color: theme.canvas,
      "&:hover": {
        // color: "white",
      },
    },
    td: {
      position: "relative",
      "& > div": {
        padding: [5, 0],
      },
    },
    tr: {
      minHeight: "4em",
      borderRadius: "0.5em",

      "& td:first-child": {
        borderRadius: "0.25em 0 0 0.25em",
        paddingLeft: "0.5em",
      },

      "& td:last-child": {
        borderRadius: "0 0.25em 0.25em 0",
        paddingRight: "0.5em",
      },

      "&:nth-child(odd)": {
        "& td": {
          background: theme.canvasSub,
        },
      },
      "&:nth-child(even)": {
        "& td": {
          background: theme.canvas,
        },
      },
    },

    dateTh: {
      width: 220,
    },
  }),

  { name: "Table" }
);

interface TableProps<
  DataType,
  KeyofDataType extends keyof DataType,
  RowWrapperProps
> extends UseCustomTableProps<DataType, KeyofDataType, RowWrapperProps> {
  RowWrapper?: <Props extends { children: ReactNode } & RowWrapperProps>(
    props: Props
  ) => JSX.Element;
  className?: string;
}

export const Table = <
  DataType,
  KeyofDataType extends keyof DataType,
  RowWrapperProps
>({
  data,
  className,
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
    <table className={classConcat(classes.table, className)}>
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
  );
};
