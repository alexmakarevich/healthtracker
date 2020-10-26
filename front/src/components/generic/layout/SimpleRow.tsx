import React, {
  ReactChild,
  ReactChildren,
  ReactElement,
  ReactNode,
} from "react";
import { JsxElement } from "typescript";

interface Props {
  children: ReactChild[];
}

export const SimpleRow = ({ children: cells }: Props) => {
  return (
    <tr>
      {cells.map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
    </tr>
  );
};
