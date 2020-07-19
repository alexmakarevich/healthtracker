import { useState, KeyboardEvent } from "react";
import React from "react";

interface Child {
  node: React.ReactNode;
  id: string;
  selected: boolean;
}

interface Props {
  className?: string;
  children: Child[];
  handleSelect: (id: Child["id"]) => void;
  handleUnselect: (id: Child["id"]) => void;
}

const SelectList = ({
  className,
  children,
  handleSelect,
  handleUnselect,
}: Props) => {
  return (
    <div className={className}>
      {children.map((child) => (
        <div
          onClick={
            child.selected
              ? () => handleUnselect(child.id)
              : () => handleSelect(child.id)
          }
        >
          {child.id}
          {child.node}
        </div>
      ))}
    </div>
  );
};

export default SelectList;
