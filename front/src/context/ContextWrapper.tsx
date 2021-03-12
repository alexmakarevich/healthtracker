import { createContext, useContext } from "react";

export function createContextDefined<ContextType>() {
  const firstContext = createContext<ContextType | undefined>(undefined);

  function useContextDefined() {
    const c = useContext(firstContext);
    if (!c) {
      throw new Error("context must be inside a Provider with a value");
    }
    return c;
  }
  return [useContextDefined, firstContext.Provider] as const;
}
