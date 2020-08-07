import { KeyboardEvent } from "react";

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
    e.preventDefault();
    if (e.key === "ArrowUp") {
      actions.up && actions.up();
    } else if (e.key === "ArrowDown") {
      actions.down && actions.down();
    } else if (e.key === "ArrowRight") {
      actions.right && actions.right();
    } else if (e.key === "ArrowLeft") {
      actions.left && actions.left();
    }
  };

  return handleKeyDown;
};
