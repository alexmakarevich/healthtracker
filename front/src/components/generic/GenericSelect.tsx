import { useState, KeyboardEvent } from "react";
import React from "react";

interface Child {
  element: React.ReactElement;
  id: string;
  isSelected: boolean;
}

export interface SelectPair {
  id: string;
  isSelected: boolean;
}

export enum SelectModes {
  SingleSelect,
  MultiSelect,
}

interface Props {
  className?: string;
  children: Child[];
  mode: SelectModes;
  handleChangeSelection: (selectPairs: SelectPair[]) => void;
}

const SelectList = ({
  className,
  children,
  mode,
  handleChangeSelection,
}: Props) => {
  function processSelectionEvent(id: Child["id"]) {
    if (mode === SelectModes.MultiSelect) {
      const newSelection: SelectPair[] = children.map((child) => ({
        id: child.id,
        isSelected: child.id === id ? !child.isSelected : child.isSelected,
      }));
      handleChangeSelection(newSelection);
    }
    // TODO: add the SingleSelect case
  }

  return (
    <div className={className}>
      {children.map((child) =>
        React.cloneElement(child.element, {
          onSelectionEvent: () => processSelectionEvent(child.id),
        })
      )}
    </div>
  );
};

export default SelectList;
