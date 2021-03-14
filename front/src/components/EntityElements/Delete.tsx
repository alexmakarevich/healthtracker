import React, { ButtonHTMLAttributes } from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Button } from "../generic/buttons/Button";
import { Icon, IconSizes } from "../generic/styling/Icon";

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

export const DeleteButton = ({
  mode,
  onDelete,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const classes = useStyles();

  return mode !== ItemModes.New ? (
    <Button onClick={onDelete} {...rest}>
      {/* delete */}
      <Icon icon={"trashcan"} size={IconSizes.S} />
    </Button>
  ) : (
    <></>
  );
};
