import React, { useMemo } from "react";
// import {useState} from 'react';
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Columns, Row } from "../../hooks/useCustomTable";
import { Table } from "../generic/layout/Table";
import { NutritionEventContext } from "../../context/NutritionEventContextProvider";

import { NutritionEventFields } from "./NutritionEventFields";
import { NutritionEventData, nutritionEventDefaults } from "shared";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritiionTable" });

export const NutritiionEventTable = () => {
  const { all } = NutritionEventContext.use();
  const classes = useStyles();
  interface NutritiionEventTableData {
    event: string;
    nutrition: string;
    delete: undefined;
  }

  const makeRow =
    (initialMode: ItemModes) =>
    (
      nutritionEvent: NutritionEventData
    ): Row<
      NutritiionEventTableData,
      {
        data: NutritionEventData;
        initialMode: ItemModes;
      }
    > => ({
      cellData: {
        nutrition: { data: nutritionEvent.nutritionId },
        event: { data: nutritionEvent.eventId },
        delete: { data: undefined },
      },
      key: nutritionEvent._id,
      rowWrapperProps: { data: nutritionEvent, initialMode },
    });

  const tableData: Row<
    NutritiionEventTableData,
    {
      data: NutritionEventData;
      initialMode: ItemModes;
    }
  >[] = (all ?? []).map(makeRow(ItemModes.QuickEdit));

  const newRow = makeRow(ItemModes.New)(nutritionEventDefaults);

  const columns: Columns<NutritiionEventTableData> = useMemo(
    () => ({
      nutrition: {
        title: "nutrition",
        renderFn: () => (
          <>
            <NutritionEventFields.Nutrition />
          </>
        ),
      },
      event: {
        title: "event",
        renderFn: () => (
          <>
            <NutritionEventFields.Event />
            <NutritionEventFields.Buttons />
          </>
        ),
      },
      delete: { title: "", renderFn: () => <NutritionEventFields.Delete /> },
    }),
    []
  );

  const tableProps = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: [
      "event",
      "nutrition",
      "delete",
    ] as (keyof NutritiionEventTableData)[],
  };

  return <Table {...tableProps} RowWrapper={NutritionEventFields.Wrapper} />;
};
