import React, { ReactNode, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { classConcat, Enummed } from "../../../utils/utils";
import { Button } from "../buttons/Button";
import { Box } from "../styling/Box";
import { Icon, IconSizes } from "../styling/Icon";

// const enum AlertTypes {
//   POSITIVE = "POSITIVE",
//   NEGATIVE = "NEGATIVE",
//   NEUTRAL = "NEUTRAL",
// }

export const AlertTypes = {
  POSITIVE: {
    name: "POSITIVE",
    style: {
      background: "lightgreen",
    },
  },
  NEGATIVE: {
    name: "NEGATIVE",
    style: {
      background: "lightcoral",
    },
  },
  NEUTRAL: {
    name: "NEUTRAL",
    style: {
      background: "lightgray",
    },
  },
} as const;

export interface AlertProps {
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
      boxShadow: "rgba(0, 0, 0, 0.5) 0 2px 10px 0px",
    }),
    flex: {
      display: "inline-flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    button: {
      marginLeft: "10px",
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
        <Button className={classes.button} onClick={onRemove}>
          <Icon icon={"cross"} size={IconSizes.S} />
        </Button>
      </div>
    </Box>
  );
};
