import React, { useState } from "react";

const useRenderingHook = (strings: string[]) => {
  const props: React.DOMAttributes<HTMLDivElement>[] = strings.map((str) => ({
    children: str,
  }));
  return { props };
};

export const CheckHowHooksRerender = () => {
  const [strings, setStrings] = useState(["one", "two", "three"]);
  const { props: propSet } = useRenderingHook(strings);
  return (
    <div>
      {propSet.map((props) => (
        <div {...props} />
      ))}
      <button onClick={() => setStrings((strings) => [...strings, "new"])}>
        add
      </button>
    </div>
  );
};
