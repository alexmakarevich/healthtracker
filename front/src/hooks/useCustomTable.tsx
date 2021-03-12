"use strict";
import React, { ReactNode } from "react";
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

export type Row<T, RowWrapperProps> = {
  cellData: CellData<T>;
  rowWrapper?: <PropsWithChildren extends { children: ReactNode }>(
    props: PropsWithChildren
  ) => ReactNode;
  rowWrapperProps?: RowWrapperProps;
};

/** the shape validator ensures that the type of data and the provided array of columns are an exact match */
export interface UseCustomTableProps<T, K extends keyof T, RowWrapperProps> {
  data: ValidateShapeAndReturn<T, Record<K, T[K]>, Row<T, RowWrapperProps>[]>;
  columns: ValidateShapeAndReturn<T, Record<K, T[K]>, Columns<T>>;
  columnKeys: K[];
  rowWrapperFn?: (
    props: RowWrapperProps
  ) => <PropsWithChildren extends { children: ReactNode }>(
    props: PropsWithChildren
  ) => JSX.Element;
  sort?: { by: K; isAscending: boolean };
}

export const useCustomTable = <T, K extends keyof T, RowWrapperProps>({
  data,
  columns,
  columnKeys,
  rowWrapperFn,
  sort,
}: UseCustomTableProps<T, K, RowWrapperProps>) => {
  // console.log({ data });

  const columnsToMerge = columnKeys.reduce<K[]>(
    (prevKeys, currKey) =>
      columns[currKey].mergeRepeating ? [...prevKeys, currKey] : prevKeys,
    []
  );

  const sortedData = sort
    ? data.sort((a: Row<T, RowWrapperProps>, b: Row<T, RowWrapperProps>) => {
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
        const comparison = sortFn(
          a.cellData[sort.by].data,
          b.cellData[sort.by].data
        );

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
    (accumulated, current, index) => [
      ...accumulated,
      { children: columns[current].title, key: index },
    ],
    []
  );

  const rowAndCellProps = mergedData.reduce<
    {
      rowWrapper:
        | undefined
        | (<PropsWithChildren extends { children: ReactNode }>(
            props: PropsWithChildren
          ) => JSX.Element);
      rowProps: React.TableHTMLAttributes<HTMLTableRowElement>;
      cellProps: React.TdHTMLAttributes<HTMLTableCellElement>[];
    }[]
  >((accumulated, currentRow, rowIndex) => {
    return [
      ...accumulated,
      {
        rowWrapper:
          rowWrapperFn &&
          currentRow.rowWrapperProps &&
          rowWrapperFn(currentRow.rowWrapperProps),
        rowProps: {
          key: rowIndex,
          className:
            "" /** TODO: figure out why removing className breaks everything */,
          // children: ["child"],
        },
        cellProps: columnKeys.reduce<
          React.TdHTMLAttributes<HTMLTableCellElement>[]
        >((acc, currentColKey, cellIndex) => {
          const { data, rowSpan, colSpan, isHidden } = currentRow.cellData[
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
                  key: cellIndex,
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

function mergeRepeatingRows<T, K extends keyof T, RowWrapperProps>(
  data: Row<T, RowWrapperProps>[],
  columnsToMerge: K[]
) {
  let newData: Row<T, RowWrapperProps>[] = data;

  /** the top row is covered in the second to last step */
  for (let i = data.length - 1; i >= 1; i--) {
    const thisRow = data[i];
    const aboveRow = data[i - 1];

    let newThisRow: Row<T, RowWrapperProps> = { ...thisRow };
    let newAboveRow: Row<T, RowWrapperProps> = { ...aboveRow };

    columnsToMerge.forEach((columnKey) => {
      const thisCell = thisRow.cellData[columnKey];
      const aboveCell = aboveRow.cellData[columnKey];

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

      newThisRow.cellData[columnKey] = newThisCell;
      newAboveRow.cellData[columnKey] = newAboveCell;
    });

    newData[i] = { ...newThisRow };
    newData[i - 1] = { ...newAboveRow };
  }

  return newData;
}
