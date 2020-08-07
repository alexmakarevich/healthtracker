import React, { DOMAttributes } from "react";
import { createUseStyles } from "react-jss";
import {
  generateArrowKeyActions,
  generateKeyPressActions,
} from "../../utils/utils";

const useStyles = createUseStyles(
  {
    wrapper: {
      display: "flex",
      height: "1.75rem",
    },
    buttons: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      "& button": {
        padding: "0",
        border: 0,
        fontSize: 0.75 + "rem",
        lineHeight: 0.75 + "rem",
        flexGrow: 1,
        flexShrink: 1,
        width: 1 + "rem",
        background: "black",
        color: "white",
        fontWeight: "bold",
      },
    },
  },
  { name: "InputIncrementable" }
);

interface Props /* extends DOMAttributes<HTMLInputElement> */ {
  textValue: string;
  onTextChange: (string: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
  onEnter?: () => void;
}

export const InputIncrementable = (
  props: Props,
  rest: DOMAttributes<HTMLInputElement>
) => {
  const classes = useStyles();

  const arrowKeyActions = generateArrowKeyActions({
    up: () => props.onIncrement(),
    down: () => props.onDecrement(),
    right: () => props.onRightArrow && props.onRightArrow(),
    left: () => props.onLeftArrow && props.onLeftArrow(),
  });

  const handleEnterPress = generateKeyPressActions([
    { code: 13, actiion: () => props.onEnter && props.onEnter() },
  ]);

  return (
    <div className={classes.wrapper}>
      <input
        type={"text"}
        value={props.textValue}
        onChange={(e) => props.onTextChange(e.target.value)}
        onKeyPress={handleEnterPress}
        {...rest}
        onKeyDown={arrowKeyActions}
      />
      <div className={classes.buttons}>
        <button onClick={props.onIncrement}>+</button>
        <button onClick={props.onDecrement}>-</button>
      </div>
    </div>
  );
};
