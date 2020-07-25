import React, { createContext, ReactNode } from "react";
import ContextGenerator, {
  ContextProps,
  initialContextValue,
} from "./ContextGenerator";

export const NutritionContext = createContext<ContextProps>(
  initialContextValue
);

interface Props {
  children: ReactNode;
}

function NIContext({ children }: Props) {
  return (
    //TODO: figure out why context updates are inconsistent, especially when it comes to a refresh, following a change
    <ContextGenerator
      apiBaseUrl={"http://localhost:4000/nutritionItems"}
      context={NutritionContext}
    >
      {children}
    </ContextGenerator>
  );
}

export default NIContext;
