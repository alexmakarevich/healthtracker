import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../../utils/utils";
import { InputScaled, InputScaledProps } from "../InputScaled";

const useStyles = createUseStyles(
  {
    input: {
      // width: "2.5rem",
    },
  },
  { name: "InputMinutes" }
);

type Props = {
  minutes: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
} & Omit<InputScaledProps, "onChange">;

export const InputMinutes = forwardRef(
  (props: Props, ref: Ref<HTMLInputElement>) => {
    const { minutes, onChange, className, ...rest } = props;

    const classes = useStyles();
    const [formatted, setFormatted] = useState(props.minutes.toString());
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      setFormatted(
        props.minutes > 9
          ? props.minutes.toString()
          : "0" + props.minutes.toString()
      );
    }, [props]);

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
      <>
        <div
          className={classConcat(classes.input, className)}
          style={{
            position: "absolute",
            zIndex: 1000,
            opacity: "0",
            whiteSpace: "pre",
          }}
        >
          {formatted}
        </div>
        <InputScaled
          ref={ref}
          hideButtons={true}
          className={classConcat(classes.input, className)}
          type={"number"}
          value={formatted}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
          {...rest}
        />
      </>
    );
  }
);
