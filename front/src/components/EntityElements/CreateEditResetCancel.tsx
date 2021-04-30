import React, { HTMLProps } from "react";
import { createUseStyles } from "react-jss";
import { classConcat, ItemModes } from "../../utils/utils";
import { Button } from "../generic/buttons/Button";
import { Icon, IconSizes } from "../generic/styling/Icon";

export type CreateEditResetCancelProps = {
  mode: ItemModes;
  onSetMode: (mode: ItemModes) => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onReset: () => void;
  onCreate: () => void;
  valid: boolean;
  isFlexRow?: boolean;
} & HTMLProps<HTMLDivElement>;

const useStyles = createUseStyles(
  {
    buttons: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      "& > button": {
        flexGrow: 1,
      },
    },
    flexRow: {
      flexDirection: "row",
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
  isFlexRow,
  valid,
  className,
  ...wrapperProps
}: CreateEditResetCancelProps) => {
  const classes = useStyles();

  if (mode === ItemModes.QuickEdit) return null;

  return (
    <div
      className={classConcat(
        classes.buttons,
        isFlexRow ? classes.flexRow : "",
        className
      )}
      {...wrapperProps}
    >
      {mode === ItemModes.Show && (
        <Button onClick={() => onSetMode(ItemModes.Edit)}>
          <Icon icon={"pen"} size={IconSizes.S} />
        </Button>
      )}
      {mode === ItemModes.Edit && (
        <>
          <Button disabled={!valid} onClick={() => onSave()}>
            <Icon icon={"checkRectangle"} size={IconSizes.S} />
          </Button>
          <Button onClick={() => onCancelEdit()}>
            <Icon icon={"undo"} size={IconSizes.S} />
          </Button>
        </>
      )}
      {mode === ItemModes.New && (
        <>
          <Button disabled={!valid} onClick={() => onCreate()}>
            <Icon icon={"plus"} size={IconSizes.S} />
            create
          </Button>
          <Button onClick={() => onReset()}>
            <Icon icon={"undo"} size={IconSizes.S} />
            reset
          </Button>
        </>
      )}
    </div>
  );
};

export { CreateEditResetCancel };
