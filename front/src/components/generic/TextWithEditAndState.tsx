import { useState, KeyboardEvent, useEffect, FocusEvent } from "react";
import React from "react";
import { InputText } from "./InputText";
import TextWithEdit from "./TextWithEdit";

interface Props extends React.DOMAttributes<any> {
  text: string;
  initialEdit?: boolean;
  className?: string;
  onCommit: (txtToCommit: string) => void;
}

// onCommit did not trigger state updates in parent for some reason. while it's not even suppposed to be used like that, that's still weird.

const TextWithEditAndState = ({
  text,
  className,
  initialEdit = false,
  onCommit,
  ...rest
}: Props) => {
  const [isEdit, setIsEdit] = useState(initialEdit);
  const [textState, setTextState] = useState(text);

  useEffect(() => {
    setTextState(text);
  }, [text]);

  function handleClick() {
    if (!isEdit) {
      setIsEdit(true);
    }
  }

  return (
    <TextWithEdit
      text={textState}
      isEdit={isEdit}
      onTextChange={(str) => setTextState(str)}
      className={className}
      onEnter={() => {
        setIsEdit(false);
        onCommit(textState);
      }}
      onClick={handleClick}
      onBlur={(_event: FocusEvent) => {
        console.log("onBlur on textwithedit");
        setIsEdit(false);
        onCommit(textState);
      }}
      {...rest}
    />
  );
};

export default TextWithEditAndState;
