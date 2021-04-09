import React, { ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { Theme } from "../../../styling/theme";
import { classConcat, Enummed } from "../../../utils/utils";
import { Button } from "../buttons/Button";
import { Box } from "../styling/Box";
import { Icon, IconSizes } from "../styling/Icon";

export const AlertTypes = {
  POSITIVE: {
    name: "POSITIVE",
  },
  NEGATIVE: {
    name: "NEGATIVE",
  },
  NEUTRAL: {
    name: "NEUTRAL",
  },
} as const;

export interface AlertProps {
  type?: Enummed<typeof AlertTypes>;
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
}

const useStyles = createUseStyles(
  (theme: Theme) => ({
    wrapper: {
      minHeight: "30px",
      display: "inline-block",
      wordBreak: "break-word",
      width: "100%",
      margin: "5px",
      fontSize: "0.75em",
      boxShadow: "rgba(0, 0, 0, 0.5) 0 2px 10px 0px",
    },
    POSITIVE: { background: theme.good },
    NEGATIVE: { background: theme.bad },
    NEUTRAL: { background: theme.neutral },
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
  const classes = useStyles();
  return (
    <Box
      className={classConcat(classes.wrapper, classes[type.name], className)}
    >
      <div className={classes.flex}>
        {children}
        <Button className={classes.button} onClick={onRemove}>
          <Icon icon={"cross"} size={IconSizes.S} />
        </Button>
      </div>
    </Box>
  );
};
