import React, { ComponentProps, ReactNodeArray } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";

interface Props extends ComponentProps<"div"> {
  children: ReactNodeArray;
  childClassName?: string;
}

const useStyles = createUseStyles(
  {
    container: {
      display: "flex",
      alignItems: "center",
    },
    child: {
      padding: "5px",
    },
  },
  { name: "FlexRow" }
);

export const FlexRow = ({ children, childClassName }: Props) => {
  const cells = children.filter((child) => child !== undefined);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {cells.map((cell, index) => (
        <div className={classConcat(classes.child, childClassName)} key={index}>
          {cell}
        </div>
      ))}
    </div>
  );
};
