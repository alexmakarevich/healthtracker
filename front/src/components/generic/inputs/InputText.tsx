import React, { ReactNode, forwardRef, Ref, InputHTMLAttributes } from "react";
import { createUseStyles } from "react-jss";
import { generateKeyPressActions } from "../../../utils/utils";

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

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  className?: string;
  children?: ReactNode;
  inputRef?: Ref<any>;
  onTextChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
}

const InputText = forwardRef(
  ({
    value,
    className,
    children,
    onTextChange,
    onEnter,
    inputRef,
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
          ref={inputRef}
          {...rest}
          className={classes.input}
          value={value}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyPressCapture={handleEnterPress}
        />
      </div>
    );
  }
);

export { InputText };
