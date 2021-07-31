import React, { forwardRef, Ref, useEffect, useState } from "react";
import { InputScaled, InputScaledProps } from "../InputScaled";

type Props = {
  hours: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputHours = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const [formatted, setFormatted] = useState(props.hours.toString());

    useEffect(() => {
      setFormatted(
        props.hours > 9 ? props.hours.toString() : "0" + props.hours.toString()
      );
    }, [props.hours]);

    function handleChange(eventValue: string) {
      const n = parseInt(eventValue);
      if (n > 99 || n < -1) {
      } else if (n >= 0 && n <= 23) {
        props.onChange(n);
      } else if (n < 0) {
        props.onChange(23);
      } else if (n > 23) {
        props.onChange(0);
      }
    }

    return (
      <InputScaled
        hideButtons={true}
        ref={ref}
        className={props.className}
        type={"number"}
        value={formatted}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  }
);
