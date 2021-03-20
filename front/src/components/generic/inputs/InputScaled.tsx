import classes from "*.module.css";
import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { classConcat } from "../../../utils/utils";
import { Input, InputProps } from "./Input";

const useStyles = createUseStyles(
  {
    input: {
      // width: "2.5rem",
      padding: [1, 2],
    },
  },
  { name: "InputMScaled" }
);

export type InputScaledProps = InputProps & {
  plusWidth?: number;
};

export const InputScaled = forwardRef(
  (props: InputScaledProps, ref: Ref<HTMLInputElement>) => {
    const { className, value, plusWidth, hideButtons, ...rest } = props;

    const classes = useStyles();
    const [width, setWidth] = useState(0);
    const fakeRef = useRef<HTMLDivElement>(null);
    const spanWidth = fakeRef.current?.offsetWidth;

    const plusWidtWithFallback = plusWidth ?? (hideButtons ? 2 : 20);

    console.log({ plusWidth });
    console.log({ plusWidtWithFallback });

    useEffect(() => {
      console.log({ spanWidth });
      console.log({
        offsetWidth: fakeRef.current?.offsetWidth ?? 0,
        clientWdith: fakeRef.current?.clientWidth ?? 0,
        scrollWdith: fakeRef.current?.scrollWidth ?? 0,
      });

      setWidth((fakeRef.current?.offsetWidth ?? 10) + plusWidtWithFallback);
    }, [fakeRef, props, spanWidth, className]);

    return (
      <>
        <div
          ref={fakeRef}
          className={classConcat(classes.input, className)}
          style={{
            position: "absolute",
            zIndex: -1000,
            opacity: "0",
            whiteSpace: "pre",
            left: "-100%",
            bottom: "-100%",
          }}
        >
          {value}
        </div>
        <Input
          ref={ref}
          value={value}
          hideButtons={hideButtons}
          className={classConcat(classes.input, className)}
          style={{ width }}
          {...rest}
        />
      </>
    );
  }
);
