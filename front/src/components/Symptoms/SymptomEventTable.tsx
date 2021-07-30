import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Columns, Row } from "../../hooks/useCustomTable";
import { Table } from "../generic/layout/Table";
import { SymptomEventData, symptomEventDefaults } from "shared";
import { useSymptomEventContext } from "../../context/SymptomEventContextProvider";
import { SymptomEventFields } from "./SymptomEventFields";

const styles = () => ({
  tableInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "2px transparent solid",
    "&:hover": {
      borderBottom: "2px #444 solid",
    },
    "&:active": {
      borderBottom: "2px #000 solid",
    },
  },
});

const useStyles = createUseStyles(styles, { name: "SymptomEventTable" });

export const SymptomEventTable = () => {
  const { all } = useSymptomEventContext();
  const classes = useStyles();
  interface SymptomEventTableData {
    symptom: string;
    event: string;
    strength: number;
    delete: undefined;
  }

  const makeRow =
    (initialMode: ItemModes) =>
    (
      symptomEvent: SymptomEventData
    ): Row<
      SymptomEventTableData,
      {
        data: SymptomEventData;
        initialMode: ItemModes;
      }
    > => ({
      cellData: {
        symptom: { data: symptomEvent.symptomId },
        strength: { data: symptomEvent.strength },
        event: { data: symptomEvent.eventId },
        delete: { data: undefined },
      },
      key: symptomEvent._id,
      rowWrapperProps: { data: symptomEvent, initialMode },
    });

  const tableData: Row<
    SymptomEventTableData,
    {
      data: SymptomEventData;
      initialMode: ItemModes;
    }
  >[] = (all ?? []).map(makeRow(ItemModes.QuickEdit));

  const newRow = makeRow(ItemModes.New)(symptomEventDefaults);

  const columns: Columns<SymptomEventTableData> = useMemo(
    () => ({
      symptom: {
        title: "symptom",
        renderFn: () => (
          <>
            <SymptomEventFields.Symptom />
          </>
        ),
      },
      strength: {
        title: "strength",
        renderFn: () => (
          <SymptomEventFields.Strength className={classes.tableInput} />
        ),
      },
      event: {
        title: "event",
        renderFn: () => (
          <>
            <SymptomEventFields.EventField />
            <SymptomEventFields.Buttons />
          </>
        ),
      },
      delete: { title: "", renderFn: () => <SymptomEventFields.Delete /> },
    }),

    [classes.tableInput]
  );

  console.log({ tableData, makeRow });

  const tableProps = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: [
      "event",
      "symptom",
      "strength",
      "delete",
    ] as (keyof SymptomEventTableData)[],
  };

  return <Table {...tableProps} RowWrapper={SymptomEventFields.Wrapper} />;
};
