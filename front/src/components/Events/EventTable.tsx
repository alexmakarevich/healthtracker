import React, { useMemo } from "react";
// import {useState} from 'react';
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Columns, Row } from "../../hooks/useCustomTable";
import { Table } from "../generic/layout/Table";
import { useEventContext } from "../../context/EventContextProvider";
import { EventFields } from "./EventFields";
import { eventDefaults, EventData } from "shared";

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "NutritiionTable" });

export const EventTable = () => {
  const { all } = useEventContext();
  const classes = useStyles();
  interface EventTableData {
    event: string;
    delete: undefined;
  }

  const makeRow =
    (initialMode: ItemModes) =>
    (
      event: EventData
    ): Row<
      EventTableData,
      {
        event: EventData;
        initialMode: ItemModes;
      }
    > => ({
      cellData: {
        event: { data: event.time },
        delete: { data: undefined },
      },
      key: event._id,
      rowWrapperProps: { event, initialMode },
    });

  const tableData: Row<
    EventTableData,
    {
      event: EventData;
      initialMode: ItemModes;
    }
  >[] = (all ?? []).map(makeRow(ItemModes.QuickEdit));

  const newRow = makeRow(ItemModes.New)(eventDefaults);

  const columns: Columns<EventTableData> = useMemo(
    () => ({
      event: {
        title: "event",
        renderFn: () => (
          <>
            <EventFields.DateTime />
            <EventFields.Buttons />
          </>
        ),
      },
      delete: { title: "", renderFn: () => <EventFields.Delete /> },
    }),
    []
  );

  const tableProps = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: ["event", "delete"] as (keyof EventTableData)[],
  };

  return <Table {...tableProps} RowWrapper={EventFields.Wrapper} />;
};
