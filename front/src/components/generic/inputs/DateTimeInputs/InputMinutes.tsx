import React, { forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    input: {
      // width: "2rem",
    },
  },
  { name: "InputMinutes" }
);

interface Props {
  hours: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputMinutes = forwardRef((props: Props, ref: Ref<any>) => {
  const classes = useStyles();

  function handleChange(eventValue: string) {
    const n = parseInt(eventValue);
    if (n >= 0 && n <= 59) {
      props.onChange(n);
    }
    if (n < 0) {
      props.onChange(59);
    }
    if (n > 59) {
      props.onChange(0);
    }
  }

  return (
    <div>
      {/* <InputIncrementable
        ref={ref}
        className={classes.input}
        textValue={props.hours}
        onIncrement={() => handleNoUpdate(month + 1)}
        onDecrement={() => handleNoUpdate(month - 1)}
      /> */}
    </div>
  );
});
