import React from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";

const useStyles = createUseStyles(
  () => ({
    button: {
      display: "flex",
      alignItems: "center",
      background: "#fff",
      borderRadius: "0.25em",
      border: "0",
      padding: "0.25em",
      margin: "0.25em",
      boxShadow: "rgba(0, 0, 0, 0.2) 0 0 1px 2px",
      // transition: "box-shadow 50ms ease-out 50ms",
      "&:hover": {
        boxShadow: "rgba(0, 0, 0, 0.4) 0 0 1px 1px",
        // border: "1px solid #000",
      },
      "&:active": {
        // boxShadow: "rgba(0, 0, 0, 0.66) 0px 1px 1px 0px",
      },
    },
  }),
  { name: "Button" }
);

export const Button = ({
  ...rest
}: React.HTMLAttributes<HTMLButtonElement>) => {
  const classes = useStyles();

  const { className, ...restRest } = rest;

  return (
    <button
      {...restRest}
      className={classConcat(classes.button, className)}
    ></button>
  );
};
