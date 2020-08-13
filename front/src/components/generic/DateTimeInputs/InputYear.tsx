import React, { useState, useEffect, forwardRef } from "react";
import { createUseStyles } from "react-jss";
import { InputTxtNumFn } from "../InputTxtNumFn";

const useStyles = createUseStyles(
  {
    input: {
      // width: "2.25em",
    },
  },
  { name: "InputYear" }
);

interface Props {
  year: number;
  onProperChange: (yearNo: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

function noFromString(yearString: string | undefined) {
  if (yearString === undefined) {
    return;
  }
  if (yearString.length === 0) {
    return 0;
  }
  const parsed: number = parseInt(yearString);
  if (parsed > 0) {
    return parsed;
  }
}

function stringFromNo(yearNo: number) {
  return yearNo.toString();
}

export const InputYear = forwardRef((props: Props, ref) => {
  const classes = useStyles();

  return (
    <InputTxtNumFn
      hasButtons
      ref={ref}
      value={props.year}
      inputClassName={classes.input}
      maxNo={9999}
      minNo={1970}
      minStringLengthToParse={1}
      onProperChange={props.onProperChange}
      onLeftArrow={props.onLeftArrow}
      onRightArrow={props.onRightArrow}
      noFromString={noFromString}
      stringFromNo={stringFromNo}
    />
  );
});
