import React, { ReactElement } from "react";

interface Props {
  children: ReactElement[];
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
