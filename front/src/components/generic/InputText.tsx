import React, { ReactElement, KeyboardEvent, ReactNode } from "react";
import { createUseStyles } from "react-jss";

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
  onChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
}

const InputText = ({
  value,
  className,
  children,
  onChange,
  onEnter,
  ...rest
}: Props) => {
  const classes = useStyles();
  const handleKeyPress = (e: KeyboardEvent) => {
    if (onEnter !== undefined) {
      if (e.charCode === 13) {
        onEnter();
      }
    }
  };

  return (
    <div className={`${classes.wrapper} ${className}`} {...rest}>
      {children}
      <input
        className={classes.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export { InputText };
