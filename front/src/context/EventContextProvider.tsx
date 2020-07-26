import React, { createContext, ReactNode } from "react";
import ContextGenerator, {
  ContextProps,
  initialContextValue,
} from "./ContextGenerator";

export const EventContext = createContext<ContextProps>(initialContextValue);

interface Props {
  children: ReactNode;
}

function EContext({ children }: Props) {
  return (
    <ContextGenerator
      apiBaseUrl={"http://localhost:4000/events"}
      context={EventContext}
    >
      <div>{children}</div>
    </ContextGenerator>
  );
}

export default EContext;
