import React, { useState, useEffect, forwardRef } from "react";
import { createUseStyles } from "react-jss";
import { InputTxtNumList } from "../InputTxtNumList";

const useStyles = createUseStyles(
  {
    input: {
      width: "2em",
    },
  },
  { name: "InputDay" }
);

interface Props {
  day: number;
  maxDay: number;
  itemList: {
    no: number;
    string: string;
  }[];
  onProperChange: (monthNo: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputDay = forwardRef((props: Props, ref) => {
  const classes = useStyles();

  return (
    <InputTxtNumList
      hasButtons
      ref={ref}
      value={props.day}
      inputClassName={classes.input}
      itemList={props.itemList}
      maxNo={props.maxDay}
      minNo={1}
      maxStringLength={2}
      minStringLengthToParse={2}
      onProperChange={props.onProperChange}
      onLeftArrow={props.onLeftArrow}
      onRightArrow={props.onRightArrow}
    />
  );
});
