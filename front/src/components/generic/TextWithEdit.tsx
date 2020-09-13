import { useState, KeyboardEvent, forwardRef, Ref } from "react";
import React from "react";
import { InputText } from "./inputs/InputText";

interface Props extends React.DOMAttributes<any> {
  text: string;
  isEdit: boolean;
  className?: string;
  onTextChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
  inputRef?: Ref<any>;
}

const TextWithEdit = forwardRef(
  ({
    text,
    isEdit,
    className,
    inputRef,
    onTextChange,
    onEnter,
    ...rest
  }: Props) => {
    return isEdit ? (
      <InputText
        className={className}
        value={text}
        inputRef={inputRef}
        onTextChange={onTextChange}
        onEnter={onEnter}
        {...rest}
      />
    ) : (
      <div className={className} {...rest}>
        {text}
      </div>
    );
  }
);

export default TextWithEdit;
