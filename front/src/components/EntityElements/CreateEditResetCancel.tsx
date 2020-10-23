import React from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";

interface Props {
  mode: ItemModes;
  onSetMode: (mode: ItemModes) => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  onCreate: () => void;
}

const useStyles = createUseStyles(
  {
    buttons: {
      padding: "5px",

      "& > div": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        "& > button": {
          flexGrow: 1,
        },
      },
    },
  },
  { name: "NutritionListItem" }
);

const CreateEditResetCancel = ({
  mode,
  onCancel,
  onReset,
  onSave,
  onCreate,
  onSetMode,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.buttons}>
      {mode === ItemModes.Show && (
        <button onClick={() => onSetMode(ItemModes.Edit)}>edit</button>
      )}
      {mode === ItemModes.Edit && (
        <div>
          <button onClick={() => onSave()}>save</button>
          <button onClick={() => onCancel()}>cancel</button>
        </div>
      )}
      {mode === ItemModes.New && (
        <div>
          <button onClick={() => onCreate()}>create</button>
          <button onClick={() => onReset()}>reset</button>
        </div>
      )}
    </div>
  );
};

export { CreateEditResetCancel };