import { useState, KeyboardEvent } from "react";
import React from "react";
import { render } from "@testing-library/react";
import { InputText } from "./InputText";

interface Props {
  text: string;
  isEdit: boolean;
  className?: string;
  handleChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
}

const TextWithEdit = ({
  text,
  className,
  isEdit = false,
  handleChange,
  onEnter,
}: Props) => {
  return (
    <div className={className}>
      {isEdit ? (
        <InputText value={text} onChange={handleChange} onEnter={onEnter} />
      ) : (
        <div>{text}</div>
      )}
    </div>
  );
};

export default TextWithEdit;
