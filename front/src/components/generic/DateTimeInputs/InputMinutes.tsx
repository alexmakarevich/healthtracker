import React, { forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    input: {
      width: "2rem",
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
      <input
        ref={ref}
        className={classes.input}
        type={"number"}
        value={props.hours}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
});
