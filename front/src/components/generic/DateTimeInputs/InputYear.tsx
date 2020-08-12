import React, { useState, useEffect, forwardRef } from "react";
import { createUseStyles } from "react-jss";
import { InputIncrementable } from "../InputIncrementable";

const useStyles = createUseStyles(
  {
    input: {
      width: "2.25em",
    },
  },
  { name: "InputYear" }
);

interface Props {
  year: number;
  onProperChange: (yearNo: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputYear = forwardRef((props: Props, ref) => {
  const yearDefault = props.year ? props.year : 1;

  const [year, setYear] = useState(yearDefault);
  const [yearString, setYearString] = useState(stringFromNo(yearDefault));
  const classes = useStyles();

  useEffect(() => {
    console.log("useEffect: ", props.year);
    setYear(props.year);
    setYearString(stringFromNo(props.year));
  }, [props.year]);

  function stringFromNo(yearNo: number) {
    return yearNo.toString();
  }

  console.log(yearString && noFromString(yearString));

  function noFromString(yearString: string | undefined) {
    if (yearString === undefined) {
      return;
    }
    if (yearString.length === 0) {
      return 0;
    }
    const parsed: number = parseInt(yearString);
    if (parsed > 0) {
      return parsed;
    }
  }

  function handleChange(eventValue: string) {
    console.log(eventValue);
    setYearString(eventValue.slice(0, 4));
    const no = noFromString(eventValue);
    no && handleNoUpdate(no);
  }

  function handleNoUpdate(no: number) {
    if (no > 0) {
      props.onProperChange(no);
    }
  }

  return (
    <div>
      <InputIncrementable
        textValue={yearString}
        ref={ref}
        // className={classes.input}
        inputClassName={classes.input}
        hasButtons
        onTextChange={handleChange}
        onIncrement={() => handleNoUpdate(year + 1)}
        onDecrement={() => handleNoUpdate(year - 1)}
        onLeftArrow={props.onLeftArrow}
        onRightArrow={props.onRightArrow}
      />
    </div>
  );
});
