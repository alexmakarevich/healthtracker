import React, { forwardRef, Ref, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../../utils/utils";
import { InputScaled, InputScaledProps } from "../InputScaled";

const useStyles = createUseStyles(
  {
    input: {
      // width: "2.5rem",
    },
  },
  { name: "InputHour" }
);

type Props = {
  hours: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputHours = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const classes = useStyles();
    const [formatted, setFormatted] = useState(props.hours.toString());

    useEffect(() => {
      setFormatted(
        props.hours > 9 ? props.hours.toString() : "0" + props.hours.toString()
      );
    }, [props]);

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
        className={classConcat(classes.input, props.className)}
        type={"number"}
        value={formatted}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  }
);
