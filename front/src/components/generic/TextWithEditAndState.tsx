import {
  useState,
  KeyboardEvent,
  useEffect,
  FocusEvent,
  Ref,
  forwardRef,
  useLayoutEffect,
  useRef,
} from "react";
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

const TextWithEditAndState = forwardRef(
  ({ text, className, initialEdit = false, onCommit, ...rest }: Props) => {
    const [isEdit, setIsEdit] = useState(initialEdit);
    const [textState, setTextState] = useState(text);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setTextState(text);
    }, [text]);

    function focusInput() {
      const i = inputRef.current;
      if (i) {
        i.focus();
        i.select();
        console.log(i.value);
      }
    }

    function handleClick() {
      if (!isEdit) {
        setIsEdit(true);
        focusInput();
      }
    }

    return (
      <InputText
        value={textState}
        onTextChange={(str) => setTextState(str)}
        className={className}
        inputRef={inputRef}
        onEnter={() => {
          setIsEdit(false);
          onCommit(textState);
        }}
        onClick={handleClick}
        // ISSUE: onBlur is unstable, because when clicked the cursor doesn't always appear inside the input

        onBlur={(_event: FocusEvent) => {
          console.log("onBlur on textwithedit");
          setIsEdit(false);
          onCommit(textState);
        }}
        {...rest}
      />
    );
  }
);

export default TextWithEditAndState;
