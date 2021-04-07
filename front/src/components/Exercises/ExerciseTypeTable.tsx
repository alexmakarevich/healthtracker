import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import {
  ExerciseTypeDAO,
  exerciseTypeDefaults,
} from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseFields } from "./ExerciseFields";
import { Row } from "../../hooks/useCustomTable";
import { ExerciseInstanceDAO } from "../../logic/exerciseInstanceLogic";
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
      "&:hover": {
        borderBottom: "2px #444 solid",
      },
      "&:active": {
        borderBottom: "2px #000 solid",
      },
    },
  }),
  { name: "NutritionList" }
);

export interface ExerciseTypeFieldProps {
  item: ExerciseTypeDAO;
  initialMode: ItemModes;
}

interface ExerciseTypeTableData {
  title: string;
  delete: undefined;
}

const ExerciseTypeTable = ({ className }: { className?: string }) => {
  const ETContext = useExerciseContext();
  const classes = useStyles();

  const newItem = { ...exerciseTypeDefaults };

  const dataAndNew: {
    item: ExerciseTypeDAO;
    initialMode: ItemModes;
  }[] = [
    ...(ETContext.all ?? []).map((i) => ({
      item: i,
      initialMode: ItemModes.QuickEdit,
    })),
    { item: newItem, initialMode: ItemModes.New },
  ];

  const tableData: Row<
    ExerciseTypeTableData,
    {
      item: ExerciseTypeDAO;
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

  const columns: Columns<ExerciseTypeTableData> = useMemo(
    () => ({
      title: {
        title: "title",
        renderFn: () => (
          <>
            <ExerciseFields.Buttons /> <ExerciseFields.Title />
          </>
        ),
        tdProps: { style: { maxWidth: 500 } },
      },
      delete: {
        title: "",
        renderFn: () => <ExerciseFields.Delete />,
      },
    }),
    []
  );

  const props = {
    data: tableData.slice(0, -1),
    lastRow: tableData.slice(-1)[0],
    columns,
    columnKeys: ["title", "delete"] as (keyof ExerciseTypeTableData)[],
  };

  return (
    <Table
      {...props}
      RowWrapper={ExerciseFields.Wrapper}
      className={className}
    />
    // <>
    //   <table className={className}>
    //     <thead>
    //       <tr>
    //         <th></th>
    //         <th>Title</th>
    //         <th></th>
    //       </tr>
    //     </thead>
    //     <tbody className={classes.list}>
    //       {ETContext.all &&
    //         ETContext.all.map((exercise: ExerciseTypeDAO, index: number) => (
    //           <Rowerino
    //             item={exercise}
    //             initialMode={ItemModes.QuickEdit}
    //             key={index}
    //           />
    //         ))}
    //       <Rowerino item={exerciseTypeDefaults} initialMode={ItemModes.New} />
    //     </tbody>
    //   </table>
    // </>
  );
};

const Rowerino = (props: ExerciseTypeFieldProps) => {
  return (
    <ExerciseFields.Wrapper item={props.item} initialMode={props.initialMode}>
      <SimpleRow>
        <ExerciseFields.Buttons />
        <ExerciseFields.Title />
        <ExerciseFields.Delete />
      </SimpleRow>
    </ExerciseFields.Wrapper>
  );
};

export default ExerciseTypeTable;
