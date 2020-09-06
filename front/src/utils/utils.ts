import { KeyboardEvent } from "react";

// item modes

export enum ItemModes {
  Show,
  Edit,
  QuickEdit,
  New,
}

// keypress actions

interface KeyAndAction {
  code: number;
  actiion: () => void;
}

export const generateKeyPressActions = (pairs: KeyAndAction[]) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    const foundPair = pairs.find((pair) => pair.code === e.charCode);
    foundPair && foundPair.actiion();
  };

  return handleKeyPress;
};

export const generateKeyDownActions = (pairs: KeyAndAction[]) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    console.log("handleKeyDown from generateKeyPressActions");
    console.log(e.metaKey);

    const foundPair = pairs.find((pair) => pair.code === e.keyCode);
    foundPair && foundPair.actiion();
  };

  return handleKeyPress;
};

interface ArrowKeyActions {
  up?: () => void;
  down?: () => void;
  right?: () => void;
  left?: () => void;
}

export const generateArrowKeyActions = (actions: ArrowKeyActions) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // e.preventDefault();
    if (e.key === "ArrowUp") {
      e.preventDefault();
      actions.up && actions.up();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      actions.down && actions.down();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      actions.right && actions.right();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      actions.left && actions.left();
    }
  };

  return handleKeyDown;
};

// css class concatenation

export function classConcat(...classes: (string | undefined)[]) {
  return classes.reduce((prevClass, thisClass) =>
    prevClass === undefined
      ? thisClass
      : thisClass === undefined
      ? prevClass
      : String.prototype.concat(prevClass, " ", thisClass)
  );
}
