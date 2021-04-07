import React, { ReactNode, forwardRef, Ref, HTMLProps } from "react";
import { createUseStyles } from "react-jss";
import { Theme } from "../../../styling/theme";
import { generateKeyPressActions } from "../../../utils/utils";

const useStyles = createUseStyles(
  (theme: Theme) => ({
    wrapper: {
      padding: "3px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      flexWrap: "wrap",
      borderBottom: "2px solid " + theme.textMain,
    },
    input: {
      border: "none",
      background: "transparent",
    },
  }),
  { name: "InputText" }
);

interface Props extends HTMLProps<HTMLInputElement> {
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

    const { placeholder } = rest;

    const handleEnterPress = generateKeyPressActions([
      { code: 13, actiion: () => onEnter && onEnter() },
    ]);

    return (
      <div className={`${classes.wrapper} ${className}`}>
        {children}
        <input
          ref={inputRef}
          className={classes.input}
          value={value}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyPressCapture={handleEnterPress}
          placeholder={placeholder}
          {...rest}
        />
      </div>
    );
  }
);

export { InputText };
