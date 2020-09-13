import React, { forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";
import { InputHours } from "./InputHours";
import { InputMinutes } from "./InputMinutes";

const useStyles = createUseStyles(
  {
    input: {
      width: "1.25em",
    },
  },
  { name: "InputHour" }
);

interface Props {
  hh: number;
  mm: number;
  onHourChange: (hh: number) => void;
  onMinuteChange: (mm: number) => void;
}

export const InputTime = (props: Props) => {
  const classes = useStyles();

  return (
    <div>
      {props.hh} : {props.mm}
      <InputHours hours={props.hh} onChange={props.onHourChange} />
      <InputMinutes hours={props.mm} onChange={props.onMinuteChange} />
    </div>
  );
};