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

interface Props /* extends DOMAttributes<HTMLInputElement> */ {
  value: number;
  itemList: {
    no: number;
    string: string;
  }[];
  maxNo: number;
  minNo: number;
  maxStringLength?: number;
  minStringLengthToParse: number;

  hasButtons?: boolean;
  className?: string;
  inputClassName?: string;
  buttonsClassName?: string;
  onProperChange: (value: number) => void;

  onRightArrow?: () => void;
  onLeftArrow?: () => void;
  onEnter?: () => void;
}

export const InputTxtNumList = forwardRef((props: Props, ref: Ref<any>) => {
  const classes = useStyles();
  const [string, setString] = useState(stringFromNo(props.value));

  useEffect(() => {
    console.log("useEffect: ", props.value);
    setString(stringFromNo(props.value));
  }, [props.value]);

  /* 
  TODO: make it so the right and left actions are triggered when the cursor reaches the respective edge of the input.
  for that the arrowKey actions would have to NOT override normal actions (maybe make that optional, for other use cases).
  possibly best to move that logic to a custom InputText component, and via a custom wrapper component with arrow actions.
  */

  const handleNumberChange = (no: number) => {
    if (no <= props.maxNo && no >= props.minNo) {
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

  function stringFromNo(no: number) {
    return props.itemList.find((item) => item.no === no)?.string;
  }

  function noFromString(string: string | undefined) {
    if (string === undefined || string.length < props.minStringLengthToParse) {
      return;
    }
    const foundNo = props.itemList.find((item) => item.string === string)?.no;
    if (foundNo) {
      return foundNo;
    } else {
      const parsed: number = parseInt(string);
      if (parsed) {
        return parsed;
      }
    }
  }

  function handleChange(eventValue: string) {
    console.log(eventValue, eventValue.length);

    if (props.maxStringLength && eventValue.length > props.maxStringLength) {
      console.log("break");

      return;
    } else {
      const no = noFromString(eventValue);
      console.log(no);
      if (no) {
        if (no <= props.maxNo && no >= props.minNo) {
          console.log("calling onProperChange");

          props.onProperChange(no);
        }
      }
      setString(eventValue);
    }
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
