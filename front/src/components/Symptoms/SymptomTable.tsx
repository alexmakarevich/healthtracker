import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import { SymptomContext } from "../../context/SymptomContextProvider";
import { ItemModes } from "../../utils/utils";
import { SymptomFields } from "./SymptomFields";
import { Columns, Row } from "../../hooks/useCustomTable";
import { Table } from "../generic/layout/Table";
import { SymptomData, symptomDefaults } from "shared";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "SymptomTable" });

export const SymptomTable = () => {
  const { all } = SymptomContext.use();
  const classes = useStyles();
  interface SymptomTableData {
    title: string;
    delete: undefined;
  }

  const makeRow =
    (initialMode: ItemModes) =>
    (
      Symptom: SymptomData
    ): Row<
      SymptomTableData,
      {
        data: SymptomData;
        initialMode: ItemModes;
      }
    > => ({
      cellData: {
        title: { data: Symptom.title },
        delete: { data: undefined },
      },
      key: Symptom._id,
      rowWrapperProps: { data: Symptom, initialMode },
    });

  const tableData: Row<
    SymptomTableData,
    {
      data: SymptomData;
      initialMode: ItemModes;
    }
  >[] = (all ?? []).map(makeRow(ItemModes.QuickEdit));

  const newRow = makeRow(ItemModes.New)(symptomDefaults);

  const columns: Columns<SymptomTableData> = useMemo(
    () => ({
      title: {
        title: "title",
        renderFn: () => (
          <>
            <SymptomFields.Title /> <SymptomFields.Buttons />
          </>
        ),
      },
      delete: { title: "", renderFn: () => <SymptomFields.Delete /> },
    }),
    []
  );

  const tableProps = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: ["title", "delete"] as (keyof SymptomTableData)[],
  };

  return <Table {...tableProps} RowWrapper={SymptomFields.Wrapper} />;
};
