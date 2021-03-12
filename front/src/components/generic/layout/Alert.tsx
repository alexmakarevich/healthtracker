import React, { ReactNode, useEffect } from "react";
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
  onRemove?: () => void;
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
      fontSize: "0.75em",
    }),
    flex: {
      display: "inline-flex",
      width: "100%",
      alignItems: "center",
    },
    button: {
      marginLeft: "10px",
      height: "25px",
      width: "25px",
    },
  }),

  { name: "Alert" }
);

export const Alert = ({
  children,
  type = AlertTypes.NEUTRAL,
  className,
  onRemove,
}: AlertProps) => {
  const classes = useStyles({ type });
  return (
    <Box className={classConcat(classes.wrapper, className)}>
      <div className={classes.flex}>
        {children}
        <button className={classes.button} onClick={onRemove}>
          X
        </button>
      </div>
    </Box>
  );
};
