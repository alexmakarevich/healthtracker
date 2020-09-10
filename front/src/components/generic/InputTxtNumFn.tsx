import React, {
  DOMAttributes,
  forwardRef,
  Ref,
  useEffect,
  useState,
} from "react";
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

export interface Props /* extends DOMAttributes<HTMLInputElement> */ {
  value: number;
  maxNo: number;
  minNo: number;
  maxStringLength?: number;
  minStringLengthToParse: number;

  hasButtons?: boolean;
  className?: string;
  inputClassName?: string;
  buttonsClassName?: string;
  noFromString: (string: string) => number | undefined;
  stringFromNo: (no: number) => string | undefined;
  onProperChange: (value: number) => void;

  onRightArrow?: () => void;
  onLeftArrow?: () => void;
  onEnter?: () => void;
}

export const InputTxtNumFn = forwardRef((props: Props, ref: Ref<any>) => {
  const classes = useStyles();
  const [string, setString] = useState(props.stringFromNo(props.value));

  useEffect(() => {
    console.log("useEffect: ", props.value);
    setString(props.stringFromNo(props.value));
  }, [props.value]);

  /* 
  TODO: make it so the right and left actions are triggered when the cursor reaches the respective edge of the input.
  for that the arrowKey actions would have to NOT override normal actions (maybe make that optional, for other use cases).
  possibly best to move that logic to a custom InputText component, and via a custom wrapper component with arrow actions.
  */

  const handleNumberChange = (no: number) => {
    console.log("handleNumberChange, ", no, props.minNo, props.maxNo);

    if (no <= props.maxNo && no >= props.minNo) {
      console.log("onProperChnage, ", no);
      props.onProperChange(no);
    }
  };
  const handleIncrement = () => handleNumberChange(props.value + 1);
  const handleDecrement = () => handleNumberChange(props.value - 1);

  const arrowKeyActions = generateArrowKeyActions({
    up: handleIncrement,
    down: handleDecrement,
    right: () => props.onRightArrow && props.onRightArrow(),
    left: () => props.onLeftArrow && props.onLeftArrow(),
  });

  const handleEnterPress = generateKeyPressActions([
    { code: 13, actiion: () => props.onEnter && props.onEnter() },
  ]);

  function handleChange(eventValue: string) {
    if (props.maxStringLength && eventValue.length > props.maxStringLength) {
      console.log("break");
      return;
    }

    const no = props.noFromString(eventValue);
    if (no) {
      if (no <= props.maxNo && no >= props.minNo) {
        console.log("calling onProperChange");
        props.onProperChange(no);
      }
    }
    setString(eventValue);
  }

  return (
    <div className={classConcat(classes.wrapper, props.className)}>
      <input
        ref={ref}
        type={"text"}
        className={classConcat(classes.input, props.inputClassName)}
        value={string}
        onChange={(e) => handleChange(e.target.value)}
        onKeyPress={handleEnterPress}
        onKeyDown={arrowKeyActions}
      />
      {props.hasButtons && (
        <div className={classes.buttons}>
          <button onClick={handleIncrement}>+</button>
          <button onClick={handleDecrement}>-</button>
        </div>
      )}
    </div>
  );
});
