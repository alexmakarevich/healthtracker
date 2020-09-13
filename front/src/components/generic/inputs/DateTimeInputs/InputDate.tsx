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
const currentDateLocale = currentDate.toLocaleDateString(locale);

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
    console.log("handleDayChange", n);
    const newDay = new Date(year, month, n);
    setDate(newDay);
  }

  function handleMonthChange(n: number) {
    console.log("handleMonthChange", n, " day: ", day, " year: ", year);
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
    console.log("handleYearChange", n);
    const maxDay = daysInMonth(month, n);
    if (day <= maxDay) {
      setDate(new Date(n, month, day));
    } else {
      setDate(new Date(n, month, maxDay));
    }
  }

  function daysInMonth(month: number, year: number) {
    const days = new Date(year, month + 1, 0).getDate();
    console.log(days, "days in month");
    return days;
  }

  const dayList = [
    { no: 0, string: "" },
    { no: 1, string: "01" },
    { no: 2, string: "02" },
    { no: 3, string: "03" },
    { no: 4, string: "04" },
    { no: 5, string: "05" },
    { no: 6, string: "06" },
    { no: 7, string: "07" },
    { no: 8, string: "08" },
    { no: 9, string: "09" },
    { no: 10, string: "10" },
    { no: 11, string: "11" },
    { no: 12, string: "12" },
    { no: 13, string: "13" },
    { no: 14, string: "14" },
    { no: 15, string: "15" },
    { no: 16, string: "16" },
    { no: 17, string: "17" },
    { no: 18, string: "18" },
    { no: 19, string: "19" },
    { no: 20, string: "20" },
    { no: 21, string: "21" },
    { no: 22, string: "22" },
    { no: 23, string: "23" },
    { no: 24, string: "24" },
    { no: 25, string: "25" },
    { no: 26, string: "26" },
    { no: 27, string: "27" },
    { no: 28, string: "28" },
    { no: 29, string: "29" },
    { no: 30, string: "30" },
    { no: 31, string: "31" },
  ];

  const monthList = [
    { no: 0, string: "" },
    { no: 1, string: "01" },
    { no: 2, string: "02" },
    { no: 3, string: "03" },
    { no: 4, string: "04" },
    { no: 5, string: "05" },
    { no: 6, string: "06" },
    { no: 7, string: "07" },
    { no: 8, string: "08" },
    { no: 9, string: "09" },
    { no: 10, string: "10" },
    { no: 11, string: "11" },
    { no: 12, string: "12" },
  ];

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
        onProperChange={handleDayChange}
        day={date.getDate()}
        itemList={dayList}
        maxDay={maxDays}
        onRightArrow={() => focusOn(monthRef)}
      />

      <InputMonth
        ref={monthRef}
        month={date.getMonth() + 1}
        monthList={monthList}
        onProperChange={handleMonthChange}
        onRightArrow={() => focusOn(yearRef)}
        onLeftArrow={() => focusOn(dayRef)}
      />

      <InputYear
        ref={yearRef}
        year={year}
        onProperChange={handleYearChange}
        onLeftArrow={() => focusOn(monthRef)}
      />
    </div>
  );
};

export { InputDate };
