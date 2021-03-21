import React, { useState, useRef, RefObject } from "react";
import { createUseStyles } from "react-jss";
import { InputScaledProps } from "../InputScaled";
import { InputDay } from "./InputDay";
import { InputHours } from "./InputHours";
import { InputMinutes } from "./InputMinutes";
import { InputMonth } from "./InputMonth";
import { InputYear } from "./InputYear";
const useStyles = createUseStyles(
  {
    wrapper: {
      display: "flex",
    },
    input: {
      padding: [0],
      border: "none",
      borderBottom: "2px #444 solid",
      borderTop: "2px transparent solid",
      textAlign: "center",
      background: "transparent",

      "&:hover": {
        // boxShadow: "rgba(0, 0, 0, 0.4) 0 0 1px 1px",
        borderTop: "2px transparent solid",
        borderBottom: "2px #444 solid",
      },
      "&:active": {
        borderBottom: "2px #000 solid",
        borderTop: "2px transparent solid",
      },
    },
    separator: {
      borderBottom: "2px #444 solid",
      borderTop: "2px transparent solid",
      marginTop: -4,
    },
  },
  { name: "InputDate" }
);

const locale = "ru-RU";

const currentDate = new Date();

interface InputDateTimeProps {
  date: Date;
  onChange: (d: Date) => void;
}

export const InputDateTime = ({ date, onChange }: InputDateTimeProps) => {
  const classes = useStyles();
  // const [date, onChange] = useState(currentDate);
  const dateMs = date.valueOf();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // TODO: conversion between UTC & local

  function handleDayChange(n: number) {
    onChange(new Date(year, month, n, hours, minutes, seconds, milliseconds));
  }

  function handleMonthChange(n: number) {
    onChange(new Date(year, n, day, hours, minutes, seconds, milliseconds));
  }

  function handleYearChange(n: number) {
    const maxDay = daysInMonth(month, n);
    if (day <= maxDay) {
      onChange(new Date(n, month, day, hours, minutes, seconds, milliseconds));
    } else {
      onChange(
        new Date(n, month, maxDay, hours, minutes, seconds, milliseconds)
      );
    }
  }

  function handleHourChange(n: number) {
    onChange(new Date(year, month, day, n, minutes, seconds, milliseconds));
  }

  function handleMinuteChange(n: number) {
    onChange(new Date(year, month, day, hours, n, seconds, milliseconds));
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

  // TODO: re-implement and use the onArrow props

  return (
    <div className={classes.wrapper}>
      <InputDay
        plusWidth={0}
        className={classes.input}
        ref={dayRef}
        onChange={handleDayChange}
        day={date.getDate()}
        daysInMonth={maxDays}
        onRightArrow={() => focusOn(monthRef)}
      />
      <span className={classes.separator}>.</span>
      <InputMonth
        plusWidth={0}
        className={classes.input}
        ref={monthRef}
        month={date.getMonth() + 1}
        onChange={handleMonthChange}
        onRightArrow={() => focusOn(yearRef)}
        onLeftArrow={() => focusOn(dayRef)}
      />
      <span className={classes.separator}>.</span>
      <InputYear
        plusWidth={0}
        className={classes.input}
        ref={yearRef}
        year={year}
        onChange={handleYearChange}
        onLeftArrow={() => focusOn(monthRef)}
      />
      <span className={classes.separator}>{"  "}</span>
      <InputHours
        plusWidth={0}
        className={classes.input}
        hours={hours}
        onChange={handleHourChange}
      />
      <span className={classes.separator}>:</span>
      <InputMinutes
        plusWidth={0}
        className={classes.input}
        minutes={minutes}
        onChange={handleMinuteChange}
      />
    </div>
  );
};
