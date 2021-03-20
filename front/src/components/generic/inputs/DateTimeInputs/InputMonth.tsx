import React, { useState, useEffect, forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../../utils/utils";
import { InputScaled, InputScaledProps } from "../InputScaled";

const useStyles = createUseStyles(
  {
    input: {},
  },
  { name: "InputMonth" }
);

type Props = {
  month: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputMonth = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const { month: day, onChange, className, ...rest } = props;

    const classes = useStyles();
    const [formatted, setFormatted] = useState(props.month.toString());

    useEffect(() => {
      setFormatted(
        props.month > 9 ? props.month.toString() : "0" + props.month.toString()
      );
    }, [props]);

    function handleChange(eventValue: string) {
      const n = parseInt(eventValue);

      //completely disallowing 3-digit numbers and negative numbers
      if (n > 99 || n < 0) {
      } else if (n >= 1 && n <= 12) {
        props.onChange(n);
      } else if (n < 1) {
        props.onChange(12);
      } else if (n > 12) {
        props.onChange(1);
      }
    }

    return (
      <InputScaled
        ref={ref}
        hideButtons={true}
        className={classConcat(classes.input, className)}
        type={"number"}
        value={formatted}
        onChange={(e) => handleChange(e.target.value)}
        {...rest}
      />
    );
  }
);
