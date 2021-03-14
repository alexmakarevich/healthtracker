import React from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Button } from "../generic/buttons/Button";

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
    <Button onClick={onDelete}>delete</Button>
  ) : (
    <></>
  );
};
