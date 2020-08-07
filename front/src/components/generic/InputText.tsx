import React, { ReactElement, KeyboardEvent, ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { generateKeyPressActions } from "./../../utils/utils";

const useStyles = createUseStyles(
  {
    wrapper: {
      padding: "3px",
      display: "flex",
      alignItem: "center",
      width: "100%",
      flexWrap: "wrap",
      borderBottom: "2px solid black",
    },
    input: {
      border: "none",
      background: "transparent",
    },
  },
  { name: "InputText" }
);

interface Props {
  value?: string;
  className?: string;
  children?: ReactNode;
  onTextChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
}

const InputText = ({
  value,
  className,
  children,
  onTextChange,
  onEnter,
  ...rest
}: Props) => {
  const classes = useStyles();

  const handleEnterPress = generateKeyPressActions([
    { code: 13, actiion: () => onEnter && onEnter() },
  ]);

  return (
    <div className={`${classes.wrapper} ${className}`} {...rest}>
      {children}
      <input
        className={classes.input}
        value={value}
        onChange={(event) => onTextChange(event.target.value)}
        onKeyPressCapture={handleEnterPress}
      />
    </div>
  );
};

export { InputText };
