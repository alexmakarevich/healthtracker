import React, { useState, useEffect, forwardRef, Ref } from "react";
import { InputScaled, InputScaledProps } from "../InputScaled";

type Props = {
  day: number;
  daysInMonth: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputDay = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const { day, daysInMonth, onChange, className, ...rest } = props;

    const [formatted, setFormatted] = useState(props.day.toString());

    useEffect(() => {
      setFormatted(
        props.day > 9 ? props.day.toString() : "0" + props.day.toString()
      );
    }, [props.day]);

    function handleChange(eventValue: string) {
      const n = parseInt(eventValue);
      if (n > 99 || n < 0) {
        //completely disallowing 3-digit numbers and negative numbers
      } else if (n >= 1 && n <= daysInMonth) {
        props.onChange(n);
      } else if (n < 0) {
        setFormatted(n.toString());
      } else if (n === 0) {
        props.onChange(daysInMonth);
      } else if (n === daysInMonth + 1) {
        props.onChange(1);
      } else if (n > daysInMonth + 1) {
        setFormatted(n.toString());
      }
    }

    return (
      <InputScaled
        hideButtons={true}
        ref={ref}
        className={className}
        type={"number"}
        value={formatted}
        onChange={(e) => handleChange(e.target.value)}
        {...rest}
      />
    );
  }
);
