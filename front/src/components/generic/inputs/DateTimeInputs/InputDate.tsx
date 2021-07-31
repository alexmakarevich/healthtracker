import React, { useState, useRef, RefObject } from "react";
import { createUseStyles } from "react-jss";
import { InputDay } from "./InputDay";
import { InputMonth } from "./InputMonth";
import { InputYear } from "./InputYear";
const useStyles = createUseStyles(
  {
    wrapper: {
      display: "flex",
    },
  },
  { name: "InputDate" }
);

const locale = "ru-RU";

const currentDate = new Date();

const InputDate = () => {
  const classes = useStyles();
  const [date, setDate] = useState(currentDate);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  function handleDayChange(n: number) {
    const newDay = new Date(year, month, n);
    setDate(newDay);
  }

  function handleMonthChange(n: number) {
    const maxDay = daysInMonth(n - 1, year);
    if (day <= maxDay) {
      const newMonth = new Date(year, n - 1, day);
      setDate(newMonth);
    } else {
      const newMonth = new Date(year, n - 1, maxDay);
      setDate(newMonth);
    }
  }

  function handleYearChange(n: number) {
    const maxDay = daysInMonth(month, n);
    if (day <= maxDay) {
      setDate(new Date(n, month, day));
    } else {
      setDate(new Date(n, month, maxDay));
    }
  }

  function daysInMonth(month: number, year: number) {
    const days = new Date(year, month + 1, 0).getDate();
    return days;
  }

  const maxDays = daysInMonth(month, year);

  function focusOn(ref: RefObject<any>) {
    if (ref.current !== null) {
      ref.current.focus();
    }
  }

  return (
    <div className={classes.wrapper}>
      <div>{date.toLocaleDateString(locale)}</div>
      <InputDay
        ref={dayRef}
        onChange={handleDayChange}
        day={date.getDate()}
        daysInMonth={maxDays}
        onRightArrow={() => focusOn(monthRef)}
      />

      <InputMonth
        ref={monthRef}
        month={date.getMonth() + 1}
        onChange={handleMonthChange}
        onRightArrow={() => focusOn(yearRef)}
        onLeftArrow={() => focusOn(dayRef)}
      />

      <InputYear
        ref={yearRef}
        year={year}
        onChange={handleYearChange}
        onLeftArrow={() => focusOn(monthRef)}
      />
    </div>
  );
};

export { InputDate };
