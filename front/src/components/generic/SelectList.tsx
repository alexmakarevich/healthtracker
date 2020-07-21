import { useState } from "react";
import React from "react";

export interface SelectChild {
  node: React.ReactNode;
  id: string;
  selected: boolean;
}

interface Props {
  className?: string;
  children: SelectChild[];
  onChangeSelection: (id: SelectChild["id"]) => void;
}

const SelectList = ({ className, children, onChangeSelection }: Props) => {
  return (
    <div className={className}>
      {children.map((child) => (
        <div onClick={() => onChangeSelection(child.id)}>{child.node}</div>
      ))}
    </div>
  );
};

export default SelectList;
