import React, {
  ComponentProps,
  ReactChildren,
  ReactElement,
  ReactNode,
  ReactNodeArray,
} from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";

interface Props extends ComponentProps<"div"> {
  children: (ReactElement | undefined)[] | ReactElement | undefined;
  childClassName?: string;
}

const useStyles = createUseStyles(
  {
    container: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
    },
    child: {
      // padding: "5px",
    },
  },
  { name: "FlexRow" }
);

export const FlexRow = ({ children, childClassName }: Props) => {
  const classes = useStyles();

  if (!children) return null;

  return (
    <div className={classes.container}>
      {React.Children.map(children, (child, index) =>
        !child
          ? null
          : React.cloneElement(child, {
              className: classConcat(
                classes.child,
                childClassName,
                child.props.className
              ),
              key: index,
            })
      )}
    </div>
  );
};
