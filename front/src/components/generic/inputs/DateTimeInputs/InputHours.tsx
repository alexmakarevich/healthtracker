import React, { forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    input: {
      width: "2rem",
    },
  },
  { name: "InputHour" }
);

interface Props {
  hours: number;
  onChange: (newVal: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputHours = forwardRef((props: Props, ref: Ref<any>) => {
  const classes = useStyles();

  function handleChange(eventValue: string) {
    const n = parseInt(eventValue);
    if (n >= 0 && n <= 23) {
      props.onChange(n);
    }
    if (n < 0) {
      props.onChange(23);
    }
    if (n > 23) {
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
