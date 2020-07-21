import React, { ReactElement, KeyboardEvent } from "react";

interface Props {
  value?: string;
  className?: string;
  onChange: (eventTartgetValue: string) => void;
  onEnter?: () => void;
}

const InputText = ({ value, className, onChange, onEnter, ...rest }: Props) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (onEnter !== undefined) {
      if (e.charCode === 13) {
        onEnter();
      }
    }
  };

  return (
    <input
      value={value}
      className={className}
      onChange={(event) => onChange(event.target.value)}
      onKeyPress={handleKeyPress}
      {...rest}
    />
  );
};

export { InputText };
