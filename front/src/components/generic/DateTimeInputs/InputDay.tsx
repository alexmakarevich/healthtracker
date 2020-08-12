import React, { useState, useEffect, forwardRef } from "react";
import { createUseStyles } from "react-jss";
import { InputIncrementable } from "../InputIncrementable";

const useStyles = createUseStyles(
  {
    input: {
      width: "1.25em",
    },
  },
  { name: "InputDay" }
);

interface Props {
  day: number;
  maxDay: number;
  dayList: {
    no: number;
    string: string;
  }[];
  onProperChange: (monthNo: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputDay = forwardRef((props: Props, ref) => {
  const dayDefault = props.day ? props.day : 1;

  const [day, setDay] = useState(dayDefault);
  const [dayString, setDayString] = useState(stringFromNo(dayDefault));
  const classes = useStyles();

  useEffect(() => {
    console.log("useEffect: ", props.day);
    setDay(props.day);
    setDayString(stringFromNo(props.day));
  }, [props.day]);

  function stringFromNo(dayNo: number) {
    return props.dayList.find((day) => day.no === dayNo)?.string;
  }

  console.log(dayString && noFromString(dayString));

  function noFromString(dayString: string | undefined) {
    if (dayString === undefined) {
      return;
    }
    if (dayString.length === 0) {
      return 0;
    }
    const foundNo = props.dayList.find((day) => day.string === dayString)?.no;
    if (foundNo) {
      return foundNo;
    } else {
      const parsed: number = parseInt(dayString);
      if (parsed < props.maxDay && parsed > 0) {
        return parsed;
      }
    }
  }

  function handleChange(eventValue: string) {
    console.log(eventValue);
    setDayString(eventValue.slice(0, 2));
    const no = noFromString(eventValue);
    no && handleNoUpdate(no);
  }

  function handleNoUpdate(no: number) {
    if (no <= props.maxDay && no > 0) {
      props.onProperChange(no);
    }
  }

  return (
    <div>
      <InputIncrementable
        ref={ref}
        textValue={dayString}
        inputClassName={classes.input}
        onTextChange={handleChange}
        onIncrement={() => handleNoUpdate(day + 1)}
        onDecrement={() => handleNoUpdate(day - 1)}
        onLeftArrow={props.onLeftArrow}
        onRightArrow={props.onRightArrow}
        hasButtons
      />
    </div>
  );
});
