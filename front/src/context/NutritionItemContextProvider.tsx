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

function NutritionItemContextProvider({ children }: Props) {
  return (
    <ContextGenerator
      apiBaseUrl={"http://localhost:4000/nutritionItems"}
      context={NutritionContext}
    >
      {children}
    </ContextGenerator>
  );
}

export default NutritionItemContextProvider;
