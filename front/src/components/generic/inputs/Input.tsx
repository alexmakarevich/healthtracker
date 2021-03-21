import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";

const useStyles = createUseStyles(
  {
    input: {
      "&:hover": {
        // boxShadow: "rgba(0, 0, 0, 0.4) 0 0 1px 1px",
        borderTop: "2px transparent solid",
        borderBottom: "2px #444 solid",
        background: "rgba(40, 40, 40, 0.15)",
      },
      "&:active": {
        borderBottom: "2px #000 solid",
        borderTop: "2px transparent solid",
        background: "rgba(40, 40, 40, 0.25)",
      },
      "&:focus": {
        borderBottom: "2px #000 solid",
        borderTop: "2px transparent solid",
        background: "rgba(40, 40, 40, 0.25)",
      },
    },
    hideButtons: {
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "-moz-appearance": "textfield",
    },
  },
  { name: "Input" }
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hideButtons?: boolean;
};

export const Input = forwardRef(
  (
    { className, hideButtons, ...rest }: InputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const classes = useStyles();

    return (
      <input
        ref={ref}
        className={classConcat(
          className,
          classes.input,
          hideButtons ? classes.hideButtons : ""
        )}
        {...rest}
      />
    );
  }
);
