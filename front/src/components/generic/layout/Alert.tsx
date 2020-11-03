import React, { ReactNode } from "react";
import { createUseStyles } from "react-jss";

enum AlertTypes {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

interface AleertProps {
  type?: AlertTypes;
  children: ReactNode;
}

const useStyles = createUseStyles(
  {
    wrapper: {
      minHeight: "100px",
      minWidth: "300px",
      background: "green",
      position: "fixed",
      bottom: "20px",
      right: "20pxx",
    },
  },

  { name: "ExerciseFields" }
);

export const Alert = ({ children, type }: AleertProps) => {
  const classes = useStyles();
  return <div className={classes.wrapper}>{children}</div>;
};
