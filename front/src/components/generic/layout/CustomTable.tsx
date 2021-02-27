"use strict";
import React, { useMemo, useState } from "react";
import {
  CellData,
  Columns,
  UseCustomTableProps,
  useCustomTable,
} from "../../../hooks/useCustomTable";

export const CustomTable = () => {
  interface SampleData {
    col1: number;
    col2: string;
  }

  const cellDataSource: CellData<SampleData>[] = [
    {
      col1: {
        data: 800,
        // isHidden: false,
        // rowSpan: 3
      },
      col2: {
        data: "World",
      },
    },

    {
      col1: {
        data: 300,
      },
      col2: {
        data: "one",
      },
    },
    {
      col1: {
        data: 300,
        // isHidden: false
      },
      col2: {
        data: "World",
      },
    },
    {
      col1: {
        data: 100,
        // rowSpan: 3
      },
      col2: {
        data: "two",
      },
    },
    {
      col1: {
        data: 100,
        // rowSpan: 3
      },
      col2: {
        data: "two",
      },
    },
    {
      col1: {
        data: 100,
        // rowSpan: 3
      },
      col2: {
        data: "two",
      },
    },
    {
      col1: {
        data: 500,
        // rowSpan: 3
      },
      col2: {
        data: "two",
      },
    },
  ];

  const cellData = useMemo(() => cellDataSource, []);

  const columns: Columns<SampleData> = {
    col1: {
      title: "column one",
      renderFn: (data: number) => data,
      // mergeRepeating: true
    },
    col2: {
      title: "column two",
      renderFn: (data: string) => data,
      // mergeRepeating: true,
    },
  };

  // TODO: maybe return this from single generator, together with useTable - can save on boilerplate typing like that. and/or extract interface for sort settings
  const [sortSettings, setSortSettings] = useState<
    UseCustomTableProps<SampleData, keyof SampleData>["sort"]
  >({ by: "col1", isAscending: true });

  const { headerCellProps, rowAndCellProps, sort, columnKeys } = useCustomTable(
    {
      data: cellData,
      columns,
      columnKeys: ["col1", "col2"],
      sort: sortSettings,
    }
  );

  console.log({ cellData, cellDataSource });

  const handleSortClick = (
    columnKey: keyof SampleData,
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
