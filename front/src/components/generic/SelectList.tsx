import { useState } from "react";
import React from "react";

interface Child {
  node: React.ReactNode;
  id: string;
  selected: boolean;
}

interface Props {
  className?: string;
  children: Child[];
  handleChangeSelection: (id: Child["id"]) => void;
}

const SelectList = ({ className, children, handleChangeSelection }: Props) => {
  return (
    <div className={className}>
      {children.map((child) => (
        <div onClick={() => handleChangeSelection(child.id)}>{child.node}</div>
      ))}
    </div>
  );
};

export default SelectList;
