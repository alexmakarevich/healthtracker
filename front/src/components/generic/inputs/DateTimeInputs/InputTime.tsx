import React from "react";
import { InputHours } from "./InputHours";
import { InputMinutes } from "./InputMinutes";

interface InputTimeProps {
  hh: number;
  mm: number;
  onHourChange: (hh: number) => void;
  onMinuteChange: (mm: number) => void;
}

export const InputTime = (props: InputTimeProps) => {
  return (
    <div>
      {props.hh} : {props.mm}
      <InputHours hours={props.hh} onChange={props.onHourChange} />
      <InputMinutes minutes={props.mm} onChange={props.onMinuteChange} />
    </div>
  );
};
