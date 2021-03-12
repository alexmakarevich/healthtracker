import React, { ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { classConcat, Enummed } from "../../../utils/utils";
import { Box } from "../styling/Box";

// const enum AlertTypes {
//   POSITIVE = "POSITIVE",
//   NEGATIVE = "NEGATIVE",
//   NEUTRAL = "NEUTRAL",
// }

const AlertTypes = {
  POSITIVE: {
    name: "POSITIVE",
    style: {
      background: "lightgreen",
    },
  },
  NEGATIVE: {
    name: "NEGATIVE",
    style: {
      background: "red",
    },
  },
  NEUTRAL: {
    name: "NEUTRAL",
    style: {
      background: "lightgray",
    },
  },
} as const;

interface AlertProps {
  type?: Enummed<typeof AlertTypes>;
  children: ReactNode;
  className?: string;
}

interface StyleProps {
  type: AlertProps["type"];
}

const useStyles = createUseStyles(
  () => ({
    wrapper: ({ type }: StyleProps) => ({
      ...type?.style,
      minHeight: "30px",
      display: "inline-block",
      wordBreak: "break-word",
      width: "100%",
      margin: "5px",
    }),
  }),

  { name: "Alert" }
);

export const Alert = ({
  children,
  type = AlertTypes.NEUTRAL,
  className,
}: AlertProps) => {
  const classes = useStyles({ type });
  return (
    <Box className={classConcat(classes.wrapper, className)}>{children}</Box>
  );
};
