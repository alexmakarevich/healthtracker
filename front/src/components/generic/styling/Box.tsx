import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";

const styles = () => ({
  box: {
    background: "#84d9b0",
    borderRadius: "5px",
    padding: "10px",
  },
});

const useStyles = createUseStyles(styles, { name: "Box" });

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const Box = ({ children, className, ...rest }: Props) => {
  const classes = useStyles();

  return (
    <div className={classConcat(classes.box, className)} {...rest}>
      {children}
    </div>
  );
};

export { Box };
