import React from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";

interface Props {
  mode: ItemModes;
  onDelete: () => void;
}

const useStyles = createUseStyles(
  {
    button: {},
  },
  { name: "Delete" }
);

export const DeleteButton = ({ mode, onDelete }: Props) => {
  const classes = useStyles();

  return mode !== ItemModes.New ? (
    <button onClick={onDelete}>delete</button>
  ) : (
    <></>
  );
};
