import React, { useState, useEffect, forwardRef } from "react";
import { createUseStyles } from "react-jss";
import { InputIncrementable } from "../InputIncrementable";

const useStyles = createUseStyles(
  {
    input: {
      width: "1.25em",
    },
  },
  { name: "InputMonth" }
);

interface Props {
  month: number;
  monthList: {
    no: number;
    string: string;
  }[];
  onProperChange: (monthNo: number) => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
}

export const InputMonth = forwardRef((props: Props, ref) => {
  const monthDefault = props.month ? props.month : 1;

  const [month, setMonth] = useState(monthDefault);
  const [monthString, setMonthString] = useState(stringFromNo(monthDefault));
  const classes = useStyles();

  useEffect(() => {
    console.log("useEffect: ", props.month);
    setMonth(props.month);
    setMonthString(stringFromNo(props.month));
  }, [props.month]);

  function stringFromNo(monthNo: number) {
    return props.monthList.find((month) => month.no === monthNo)?.string;
  }

  console.log(monthString && noFromString(monthString));

  function noFromString(monthString: string | undefined) {
    if (monthString === undefined) {
      return;
    }
    if (monthString.length === 0) {
      return 0;
    }
    const foundNo = props.monthList.find(
      (month) => month.string === monthString
    )?.no;
    if (foundNo) {
      return foundNo;
    } else {
      const parsed: number = parseInt(monthString);
      if (parsed < 12 && parsed > 0) {
        return parsed;
      }
    }
  }

  function handleChange(eventValue: string) {
    console.log(eventValue);
    setMonthString(eventValue.slice(0, 2));
    const no = noFromString(eventValue);
    no && handleNoUpdate(no);
  }

  function handleNoUpdate(no: number) {
    if (no <= 12 && no > 0) {
      props.onProperChange(no);
    }
  }

  return (
    <div>
      <InputIncrementable
        textValue={monthString}
        // className={classes.input}
        ref={ref}
        inputClassName={classes.input}
        onTextChange={handleChange}
        onIncrement={() => handleNoUpdate(month + 1)}
        onDecrement={() => handleNoUpdate(month - 1)}
        onLeftArrow={props.onLeftArrow}
        onRightArrow={props.onRightArrow}
      />
    </div>
  );
});
