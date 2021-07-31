import React, { useState, useEffect, forwardRef, Ref } from "react";
import { InputScaled, InputScaledProps } from "../InputScaled";

type Props = {
  year: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputYear = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const { year: day, onChange, className, ...rest } = props;
    const [formatted, setFormatted] = useState(props.year.toString());

    useEffect(() => {
      setFormatted(
        props.year > 9 ? props.year.toString() : "0" + props.year.toString()
      );
    }, [props.year]);

    function handleChange(eventValue: string) {
      const n = parseInt(eventValue);
      // a limitation of JS Date
      if (n >= 1970) {
        props.onChange(n);
      } else {
        setFormatted(eventValue);
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
