import { useState } from "react";
import React from "react";

export interface SelectChild {
  node: React.ReactNode;
  id: string;
  isSelected: boolean;
}

interface Props {
  className?: string;
  children?: (SelectChild | undefined)[];
  onChangeSelection: (id: SelectChild["id"]) => void;
}

const SelectList = ({ className, children, onChangeSelection }: Props) => {
  return (
    <div className={className}>
      {children?.map(
        (child?) =>
          child !== undefined && (
            <div key={child.id} onClick={() => onChangeSelection(child.id)}>
              {child.node}
            </div>
          )
      )}
    </div>
  );
};

export default SelectList;
