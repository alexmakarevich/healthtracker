import React, {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  Ref,
} from "react";

export interface SelectChild {
  node: React.ReactNode;
  id: string;
  isSelected: boolean;
}

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  children?: (SelectChild | undefined)[];
  onChangeSelection: (id: SelectChild["id"]) => void;
}

const SelectList = forwardRef(
  (
    { className, children, onChangeSelection, ...rest }: Props,
    ref: Ref<any>
  ) => {
    return (
      <div className={className} {...rest} ref={ref}>
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
  }
);

export default SelectList;
