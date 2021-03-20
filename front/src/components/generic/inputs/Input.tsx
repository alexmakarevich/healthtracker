import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";

const useStyles = createUseStyles(
  {
    input: {},
    hideButtons: {
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
  },
  { name: "InputMinutes" }
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
