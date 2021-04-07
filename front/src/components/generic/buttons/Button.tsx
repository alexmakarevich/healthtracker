import React, { ButtonHTMLAttributes } from "react";
import { createUseStyles } from "react-jss";
import { Theme } from "../../../styling/theme";
import { classConcat } from "../../../utils/utils";

const useStyles = createUseStyles(
  (theme: Theme) => ({
    button: {
      display: "flex",
      alignItems: "center",
      background: theme.colorPallete[1],
      borderRadius: "0.25em",
      border: "2px solid #666",
      padding: "0.25em",
      margin: "0",
      color: theme.textMain,

      // boxShadow: "rgba(0, 0, 0, 0.2) 0 0 1px 2px",
      // transition: "box-shadow 50ms ease-out 50ms",
      "&:hover": {
        // boxShadow: "rgba(0, 0, 0, 0.4) 0 0 1px 1px",
        border: "2px solid",
        // color: "#000",
      },
      "&:active": {
        // boxShadow: "rgba(0, 0, 0, 0.66) 0px 1px 1px 0px",
        border: "2px solid #fc2",
      },
    },
  }),
  { name: "Button" }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ ...rest }: ButtonProps) => {
  const classes = useStyles();

  const { className, ...restRest } = rest;

  return (
    <button
      {...restRest}
      className={classConcat(classes.button, className)}
    ></button>
  );
};
