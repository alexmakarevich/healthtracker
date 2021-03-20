import React, { useState, useEffect, forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../../utils/utils";
import { InputScaled, InputScaledProps } from "../InputScaled";
import { InputTxtNumFn } from "../InputTxtNumFn";

const useStyles = createUseStyles(
  {
    input: {
      // minWidth: "2rem",
    },
  },
  { name: "InputYear" }
);

type Props = {
  year: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputYear = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const { year: day, onChange, className, ...rest } = props;

    const classes = useStyles();
    const [formatted, setFormatted] = useState(props.year.toString());
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      setFormatted(
        props.year > 9 ? props.year.toString() : "0" + props.year.toString()
      );
    }, [props]);

    function handleChange(eventValue: string) {
      const n = parseInt(eventValue);
      // a limitation of JS Date
      if (n >= 1970) {
        props.onChange(n);
        setIsValid(true);
      } else {
        setFormatted(eventValue);
        setIsValid(false);
      }
    }

    return (
      <InputScaled
        hideButtons={true}
        ref={ref}
        className={classConcat(classes.input, className)}
        type={"number"}
        value={formatted}
        onChange={(e) => handleChange(e.target.value)}
        {...rest}
      />
    );
  }
);
