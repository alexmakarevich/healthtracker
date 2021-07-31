import React, { forwardRef, Ref, useEffect, useState } from "react";
import { InputScaled, InputScaledProps } from "../InputScaled";

type Props = {
  minutes: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputMinutes = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const { minutes, onChange, className, ...rest } = props;
    const [formatted, setFormatted] = useState(props.minutes.toString());

    useEffect(() => {
      setFormatted(
        props.minutes > 9
          ? props.minutes.toString()
          : "0" + props.minutes.toString()
      );
    }, [props.minutes]);

    function handleChange(eventValue: string) {
      const n = parseInt(eventValue);
      if (n > 99 || n < -1) {
        // diregard completely crazy inputs
      } else if (n >= 0 && n <= 59) {
        props.onChange(n);
      } else if (n < 0) {
        props.onChange(59);
      } else if (n > 59) {
        props.onChange(0);
      }
    }

    return (
      <InputScaled
        ref={ref}
        hideButtons={true}
        className={className}
        type={"number"}
        value={formatted}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        {...rest}
      />
    );
  }
);
