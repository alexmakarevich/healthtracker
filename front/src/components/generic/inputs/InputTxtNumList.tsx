import React, { forwardRef, Ref } from "react";

import { Props as FnProps, InputTxtNumFn } from "./InputTxtNumFn";

interface Props
  extends Omit<
    FnProps,
    "noFromString" | "stringFromNo"
  > /* extends DOMAttributes<HTMLInputElement> */ {
  itemList: {
    no: number;
    string: string;
  }[];
}

export const InputTxtNumList = forwardRef((props: Props, ref: Ref<any>) => {
  /* 
  TODO: make it so the right and left actions are triggered when the cursor reaches the respective edge of the input.
  for that the arrowKey actions would have to NOT override normal actions (maybe make that optional, for other use cases).
  possibly best to move that logic to a custom InputText component, and via a custom wrapper component with arrow actions.
  */

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

  return (
    <InputTxtNumFn
      ref={ref}
      {...props}
      stringFromNo={stringFromNo}
      noFromString={noFromString}
    />
  );
});
