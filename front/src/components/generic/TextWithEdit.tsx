import { useState, KeyboardEvent } from "react";
import React from "react";
import { render } from "@testing-library/react";
import classes from "*.module.css";

interface Props {
  text: string;
  isEdit: boolean;
  className?: string;
  handleChange: Function;
  onEnter?: () => void;
}

const TextWithEdit = ({
  text,
  className,
  isEdit = false,
  handleChange,
  onEnter,
}: Props) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (onEnter !== undefined) {
      if (e.charCode === 13) {
        onEnter();
      }
    }
  };

  return (
    <div className={className}>
      {isEdit ? (
        <input
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <div>{text}</div>
      )}
    </div>
  );
};

export default TextWithEdit;
