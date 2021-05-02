import React, { useMemo } from "react";
// import {useState} from 'react';
import {
  NutritionItemDAO,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import { ItemModes } from "../../utils/utils";
import { NutritionFields } from "./NutritionFields";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { Columns, Row } from "../../hooks/useCustomTable";
import { title } from "process";
import { Table } from "../generic/layout/Table";
import { useNutritionEventContext } from "../../context/NutritionEventContextProvider";
import {
  NutritionEventDAO,
  nutritionEventDefaults,
} from "../../logic/nutritionEventLogic";
import { NutritionEventFields } from "./NutritionEventFields";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritiionTable" });

export const NutritiionEventTable = () => {
  const { all } = useNutritionEventContext();
  const classes = useStyles();
  interface NutritiionEventTableData {
    event: string;
    nutrition: string;
    delete: undefined;
  }

  const makeRow = (initialMode: ItemModes) => (
    nutritionEvent: NutritionEventDAO
  ): Row<
    NutritiionEventTableData,
    {
      data: NutritionEventDAO;
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
      data: NutritionEventDAO;
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
