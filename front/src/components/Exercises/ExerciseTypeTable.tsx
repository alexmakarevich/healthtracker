import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import { ExerciseTypeData, exerciseTypeDefaults } from "shared";
import { ItemModes } from "../../utils/utils";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseFields } from "./ExerciseFields";
import { Row } from "../../hooks/useCustomTable";
import { Columns } from "../../hooks/useCustomTableNew.";
import { Table } from "../generic/layout/Table";

const useStyles = createUseStyles(
  () => ({
    list: {
      background: "#f0f0f0",
      padding: "5px",
      borderRadius: "15px",
    },
    tableInput: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "2px transparent solid",
      padding: "0.5em",
      "&:hover": {
        borderBottom: "2px #444 solid",
      },
      "&:active": {
        borderBottom: "2px #000 solid",
      },
    },
    title: {
      // margin: "0.25em",
    },
    buttons: {
      paddingTop: "0.25em",
    },
  }),
  { name: "NutritionList" }
);

export interface ExerciseTypeFieldProps {
  item: ExerciseTypeData;
  initialMode: ItemModes;
}

interface ExerciseTypeTableData {
  title: string;
  delete: undefined;
}

const ExerciseTypeTable = ({ className }: { className?: string }) => {
  const ETContext = useExerciseContext();
  const classes = useStyles();

  const dataAndNew: {
    item: ExerciseTypeData;
    initialMode: ItemModes;
  }[] = [
    ...(ETContext.all ?? []).map((i) => ({
      item: i,
      initialMode: ItemModes.QuickEdit,
    })),
  ];

  const tableData: Row<
    ExerciseTypeTableData,
    {
      item: ExerciseTypeData;
      initialMode: ItemModes;
    }
  >[] = dataAndNew.map((datum) => {
    const { item, initialMode } = datum;
    return {
      cellData: {
        title: { data: item.title },
        delete: { data: undefined },
      },
      rowWrapperProps: { item, initialMode },
      key: item._id,
    };
  });

  const newRow: Row<
    ExerciseTypeTableData,
    {
      item: ExerciseTypeData;
      initialMode: ItemModes;
    }
  > = {
    cellData: {
      title: { data: exerciseTypeDefaults.title },
      delete: { data: undefined },
    },
    rowWrapperProps: { item: exerciseTypeDefaults, initialMode: ItemModes.New },
    key: exerciseTypeDefaults._id,
  };

  const columns: Columns<ExerciseTypeTableData> = useMemo(
    () => ({
      title: {
        title: "title",
        renderFn: () => (
          <div>
            <ExerciseFields.Title className={classes.title} />
            <ExerciseFields.Buttons className={classes.buttons} />
          </div>
        ),
        tdProps: { style: { maxWidth: 500, paddingRight: "0.5em" } },
      },
      delete: {
        title: "",
        renderFn: () => <ExerciseFields.Delete />,
      },
    }),
    []
  );

  const props = {
    data: tableData,
    lastRow: newRow,
    columns,
    columnKeys: ["title", "delete"] as (keyof ExerciseTypeTableData)[],
  };

  return (
    <Table
      {...props}
      RowWrapper={ExerciseFields.Wrapper}
      className={className}
    />
  );
};

export default ExerciseTypeTable;
