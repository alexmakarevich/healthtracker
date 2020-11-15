import React, {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  Ref,
} from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../utils/utils";

const styles = () => ({
  list: {
    listStyle: "none",
    padding: 1,
    margin: 0,
    background: "#222",
    borderRadius: [0, 0, 6, 6],
  },
  item: {
    margin: [4, 4],
  },
});

const useStyles = createUseStyles(styles, { name: "SelectList" });

export interface SelectChild {
  node: React.ReactNode;
  id: string;
  isSelected: boolean;
}

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  className?: string;
  children?: (SelectChild | undefined)[];
  childItemProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  >;
  onChangeSelection: (id: SelectChild["id"]) => void;
}

const SelectList = forwardRef(
  (
    { className, children, onChangeSelection, childItemProps, ...rest }: Props,
    ref: Ref<any>
  ) => {
    const classes = useStyles();

    return (
      <ul className={classConcat(classes.list, className)} {...rest} ref={ref}>
        {children?.map(
          (child?) =>
            child !== undefined && (
              <li
                key={child.id}
                onClick={() => onChangeSelection(child.id)}
                className={classes.item}
                {...childItemProps}
              >
                {child.node}
              </li>
            )
        )}
      </ul>
    );
  }
);

export default SelectList;
