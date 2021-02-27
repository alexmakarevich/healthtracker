"use strict";
import React, { useMemo, useState } from "react";
import { ValidateShapeAndReturn } from "../utils/utils";

export interface Cell<T> {
  data: T;
  colSpan?: number;
  rowSpan?: number;
  isHidden?: boolean /** determines if cell is hidden from the DOM (mostly supposed to work with colspan/rowspan) */;
}

export type CellData<T extends Object> = {
  [c in keyof T]: Cell<T[c]>;
};

/**
 * renderFn -  fn, in case you want to have "raw" data and render it in some way in the cell, defaults to just outputting the data.
 */
export type Columns<T> = {
  [K in keyof T]: {
    title: React.ReactNode;
    mergeRepeating?: boolean;
    renderFn?: (data: T[K]) => React.ReactNode;
    groupingFn?: (data: T[K]) => React.ReactNode;
    sortAscendingFn?: (a: T[K], b: T[K]) => -1 | 0 | 1;
  };
};

/** the shape validator ensures that the type of data and the provided array of columns are an exact match */
export interface UseCustomTableProps<T, K extends keyof T> {
  data: ValidateShapeAndReturn<T, Record<K, T[K]>, CellData<T>[]>;
  columns: ValidateShapeAndReturn<T, Record<K, T[K]>, Columns<T>>;
  columnKeys: K[];
  sort?: { by: K; isAscending: boolean };
}

export const useCustomTable = <T, K extends keyof T>({
  data,
  columns,
  columnKeys,
  sort,
}: UseCustomTableProps<T, K>) => {
  console.log({ data });

  const columnsToMerge = columnKeys.reduce<K[]>(
    (prevKeys, currKey) =>
      columns[currKey].mergeRepeating ? [...prevKeys, currKey] : prevKeys,
    []
  );

  const sortedData = sort
    ? data.sort((a: CellData<T>, b: CellData<T>) => {
        const backupSortFn: (a: T[K], b: T[K]) => number = (a, b) => {
          if (
            (typeof a === "number" && typeof b === "number") ||
            (typeof a === "number" && typeof b === "number")
          ) {
            return a === b ? 0 : a < b ? -1 : 1;
          } else if (typeof a === "string" && typeof b === "string") {
            return a.localeCompare(b);
          } else {
            return 0;
          }
        };

        const sortFn =
          (columns[sort.by].sortAscendingFn as (
            a: T[K],
            b: T[K]
          ) => -1 | 0 | 1) ?? backupSortFn;
        const comparison = sortFn(a[sort.by].data, b[sort.by].data);

        return sort.isAscending ? comparison : -comparison;
      })
    : data;

  const mergedData =
    columnsToMerge.length > 0
      ? mergeRepeatingRows(sortedData, columnsToMerge)
      : sortedData;

  const headerCellProps = columnKeys.reduce<
    React.DOMAttributes<HTMLTableHeaderCellElement>[]
  >(
    (accumulated, current) => [
      ...accumulated,
      { children: columns[current].title },
    ],
    []
  );

  const rowAndCellProps = mergedData.reduce<
    {
      rowProps: React.DOMAttributes<HTMLTableRowElement>;
      cellProps: React.TdHTMLAttributes<HTMLTableCellElement>[];
    }[]
  >((accumulated, currentRow, index) => {
    return [
      ...accumulated,
      {
        rowProps: {},
        cellProps: columnKeys.reduce<
          React.TdHTMLAttributes<HTMLTableCellElement>[]
        >((acc, currentColKey) => {
          const { data, rowSpan, colSpan, isHidden } = currentRow[
            currentColKey
          ];
          const { renderFn } = columns[currentColKey] as Columns<T>[K];

          return isHidden
            ? acc
            : [
                ...acc,
                {
                  children: renderFn?.(data) ?? data,
                  rowSpan,
                  colSpan,
                  key: index,
                },
              ];
        }, []),
      },
    ];
  }, []);

  return {
    headerCellProps,
    rowAndCellProps,
    sort,
    columnKeys,
  };
};

function mergeRepeatingRows<T, K extends keyof T>(
  data: CellData<T>[],
  columnsToMerge: K[]
) {
  let newData: CellData<T>[] = data;

  /** the top row is covered in the second to last step */
  for (let i = data.length - 1; i >= 1; i--) {
    const thisRow = data[i];
    const aboveRow = data[i - 1];

    let newThisRow: CellData<T> = { ...thisRow };
    let newAboveRow: CellData<T> = { ...aboveRow };

    columnsToMerge.forEach((columnKey) => {
      const thisCell = thisRow[columnKey];
      const aboveCell = aboveRow[columnKey];

      let newThisCell: CellData<T>[K];
      let newAboveCell: CellData<T>[K];

      if (thisCell.data !== aboveCell.data) {
        newThisCell =
          i === data.length - 1
            ? { ...thisCell, isHidden: false, rowSpan: undefined }
            : { ...thisCell, isHidden: false };
        newAboveCell = { ...aboveCell, rowSpan: undefined, isHidden: false };
      } else {
        newThisCell = { ...thisCell, rowSpan: undefined, isHidden: true };
        newAboveCell = {
          ...aboveCell,
          rowSpan: (thisCell.rowSpan ?? 1) + 1,
          isHidden: false,
        };
      }

      newThisRow[columnKey] = newThisCell;
      newAboveRow[columnKey] = newAboveCell;
    });

    newData[i] = { ...newThisRow };
    newData[i - 1] = { ...newAboveRow };
  }

  return newData;
}
