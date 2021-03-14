import React from "react";
import { createUseStyles } from "react-jss";
import icons from "../../../icons/sprite.svg";
import all from "../../../icons/all.svg";

import { Enummed } from "../../../utils/utils";

export const IconSizes = {
  S: "1em",
  M: "2em",
  L: "4em",
} as const;

interface InputProps {
  // iconSrc: string;
  icon: keyof typeof ICON_MAP;
  size?: Enummed<typeof IconSizes>;
}

const ICON_MAP = {
  cross: all + "#gg-close",
} as const;

const useStyles = createUseStyles(
  () => ({
    svg: {
      fill: "black",
      height: ({ size }: InputProps) => size,
      width: ({ size }: InputProps) => size,
    },
  }),
  { name: "Icon" }
);

export const Icon = ({ icon, size = IconSizes.M }: InputProps) => {
  const classes = useStyles({ size });

  return (
    <svg className={classes.svg}>
      <use xlinkHref={ICON_MAP[icon]} />
    </svg>
  );
};
