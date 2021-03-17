import React, { useState, useEffect, forwardRef } from "react";
import { createUseStyles } from "react-jss";
import { InputTxtNumList } from "../InputTxtNumList";

const useStyles = createUseStyles(
  {
    input: {
      width: "2em",
    },
  },
  { name: "InputMonth" }
);

interface Props {
  month: number;
  monthList: {
    no: number;
    string: string;
  }[];
  onProperChange: (monthNo: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputMonth = forwardRef((props: Props, ref) => {
  const classes = useStyles();

  return (
    <InputTxtNumList
      hasButtons
      ref={ref}
      value={props.month}
      inputClassName={classes.input}
      itemList={props.monthList}
      maxNo={12}
      minNo={1}
      minStringLengthToParse={1}
      onProperChange={props.onProperChange}
      onLeftArrow={props.onLeftArrow}
      onRightArrow={props.onRightArrow}
    />
  );
});
