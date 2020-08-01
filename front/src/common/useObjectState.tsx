import { useState } from "react";

// possibly delete

export default (initialValue: any) => {
  const [obj, setObj]: [any, Function] = useState(initialValue);

  return {
    obj,
    setObj: (newObj: any) => setObj(newObj),
    updateProperty: (propName: string, propValue: any) => {
      setObj({ ...obj, [propName]: propValue });
    },
    resetObj: () => {
      setObj(initialValue);
    },
  };
};
