import React from "react";
import { createUseStyles } from "react-jss";
import all from "../../../media/icons/all.svg";

import { Enummed } from "shared";

const allUrl = all + "#gg-";

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
  // TODO: better empty implementation than broken link to sprite
  empty: "",
  cross: all + "#gg-close",
  plus: all + "#gg-math-plus",
  pen: all + "#gg-pen",
  undo: all + "#gg-undo",
  arrowDown: allUrl + "arrow-down",
  arrowUp: allUrl + "arrow-up",
  trashcan: allUrl + "trash",
  checkRectangle: allUrl + "check-r",
} as const;

const useStyles = createUseStyles(
  {
    svg: {
      // fill: "black",
      height: ({ size }: { size: Enummed<typeof IconSizes> }) => size,
      width: ({ size }: { size: Enummed<typeof IconSizes> }) => size,
    },
  },
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
