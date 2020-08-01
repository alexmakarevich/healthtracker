import { useState, KeyboardEvent } from "react";
import React from "react";
import { InputText } from "./InputText";

interface Props extends React.DOMAttributes<any> {
  text: string;
  isEdit: boolean;
  className?: string;
  onTextChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
}

const TextWithEdit: React.FC<Props> = ({
  text,
  isEdit,
  className,
  onTextChange,
  onEnter,
  ...rest
}) => {
  return isEdit ? (
    <InputText
      className={className}
      value={text}
      onTextChange={onTextChange}
      onEnter={onEnter}
      {...rest}
    />
  ) : (
    <div className={className} {...rest}>
      {text}
    </div>
  );
};

export default TextWithEdit;
