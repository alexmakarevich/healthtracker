import { KeyboardEvent } from "react";

// item modes

export enum ItemModes {
  Show = "Show",
  Edit = "Edit",
  QuickEdit = "QuickEdit",
  New = "New",
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

export const splitArray = <Something>(array?: Something[]) => (filterCallback: (something: Something) => boolean) => {
  let trueArray : Something[] = []
  let falseArray: Something[] = []

  array?.forEach((item) => {
    filterCallback(item) ? trueArray.push(item) : falseArray.push(item)
  })

  return {trueArray, falseArray}
}

export function groupBy<T extends Record<string, any>, K extends keyof T>(array: T[], key: K): Record<T[K], T[]> {
  return array.reduce(
    (objectsByKeyValue, obj) => {
      const value = obj[key]
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
      return objectsByKeyValue
    },
    {} as Record<T[K], T[]>
  )
}
