import React, { DOMAttributes, forwardRef, Ref } from "react";
import { createUseStyles } from "react-jss";
import {
  generateArrowKeyActions,
  generateKeyPressActions,
  classConcat,
} from "../../utils/utils";

const useStyles = createUseStyles(
  {
    wrapper: {
      display: "flex",
      height: "1.75rem",
    },
    input: {
      maxWidth: "100%",
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
  textValue?: string;
  hasButtons?: boolean;
  className?: string;
  inputClassName?: string;
  buttonsClassName?: string;
  onTextChange: (string: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRightArrow?: () => void;
  onLeftArrow?: () => void;
  onEnter?: () => void;
}

export const InputIncrementable = forwardRef((props: Props, ref: Ref<any>) => {
  const classes = useStyles();

  /* TODO: make it so the right and left actions are triggered when the cursor reaches the respective edge of the input.
  for that the arroKey actions would have to NOY override normal actions (maybe make that optional, for other use cases).
  possibly best to move that logic to a custom InputText component, and via a custom wrapper component with arrow actions.

  */

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
    <div className={classConcat(classes.wrapper, props.className)}>
      <input
        ref={ref}
        type={"text"}
        className={classConcat(classes.input, props.inputClassName)}
        value={props.textValue}
        onChange={(e) => props.onTextChange(e.target.value)}
        onKeyPress={handleEnterPress}
        onKeyDown={arrowKeyActions}
      />
      {props.hasButtons && (
        <div className={classes.buttons}>
          <button onClick={props.onIncrement}>+</button>
          <button onClick={props.onDecrement}>-</button>
        </div>
      )}
    </div>
  );
});
