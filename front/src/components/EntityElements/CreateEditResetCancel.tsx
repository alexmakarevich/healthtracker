import React from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";

interface Props {
  mode: ItemModes;
  onSetMode: (mode: ItemModes) => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onReset: () => void;
  onCreate: () => void;
  valid: boolean;
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
  { name: "CreateEditResetCancel" }
);

const CreateEditResetCancel = ({
  mode,
  onCancelEdit,
  onReset,
  onSave,
  onCreate,
  onSetMode,
  valid,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.buttons}>
      {mode === ItemModes.Show && (
        <button onClick={() => onSetMode(ItemModes.Edit)}>edit</button>
      )}
      {mode === ItemModes.Edit && (
        <div>
          <button disabled={!valid} onClick={() => onSave()}>
            save
          </button>
          <button onClick={() => onCancelEdit()}>cancel</button>
        </div>
      )}
      {mode === ItemModes.New && (
        <div>
          <button disabled={!valid} onClick={() => onCreate()}>
            create
          </button>
          <button onClick={() => onReset()}>reset</button>
        </div>
      )}
    </div>
  );
};

export { CreateEditResetCancel };
