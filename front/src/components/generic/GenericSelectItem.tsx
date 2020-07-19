import { useState, KeyboardEvent } from "react";
import React from "react";

interface Props {
  className?: string;
  title?: string;
  selected?: boolean;
  onSelectionEvent?: () => void;
}

const SelectList = ({
  className,
  title,
  selected,
  onSelectionEvent,
}: Props) => {
  return (
    <div className={className} onClick={onSelectionEvent}>
      {selected ? "selected" : "not"} - {title}
    </div>
  );
};

export default SelectList;
