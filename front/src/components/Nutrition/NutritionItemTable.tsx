import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import { ItemModes } from "../../utils/utils";
import { NutritionFields } from "./NutritionFields";
import { Columns, Row } from "../../hooks/useCustomTable";
import { Table } from "../generic/layout/Table";
import { NutritionItemData, nutritionItemDefaults } from "shared";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritiionTable" });

export const NutritiionTable = () => {
  const { all } = useNutritionItemContext();
  const classes = useStyles();
  interface NutritiionTableData {
    title: string;
    ingredients: number;
    delete: undefined;
  }

  const makeRow =
    (initialMode: ItemModes) =>
    (
      nutrition: NutritionItemData
    ): Row<
      NutritiionTableData,
      {
        data: NutritionItemData;
        initialMode: ItemModes;
      }
    > => ({
      cellData: {
        title: { data: nutrition.title },
        ingredients: { data: nutrition.ingredientIds.length },
        delete: { data: undefined },
      },
      key: nutrition._id,
      rowWrapperProps: { data: nutrition, initialMode },
    });

  const tableData: Row<
    NutritiionTableData,
    {
      data: NutritionItemData;
      initialMode: ItemModes;
    }
  >[] = (all ?? []).map(makeRow(ItemModes.QuickEdit));

  const newRow = makeRow(ItemModes.New)(nutritionItemDefaults);

  const columns: Columns<NutritiionTableData> = useMemo(
    () => ({
      title: {
        title: "title",
        renderFn: () => (
          <>
            <NutritionFields.Title /> <NutritionFields.Buttons />
          </>
        ),
      },
      ingredients: {
        title: "ingredients",
        renderFn: () => <NutritionFields.Ingredients />,
      },
      delete: { title: "", renderFn: () => <NutritionFields.Delete /> },
    }),
    []
  );

  const tableProps = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: [
      "title",
      "ingredients",
      "delete",
    ] as (keyof NutritiionTableData)[],
  };

  return <Table {...tableProps} RowWrapper={NutritionFields.Wrapper} />;
};
