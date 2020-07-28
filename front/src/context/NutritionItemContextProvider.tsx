import React, { ReactNode } from "react";
import contextGeneratorFn from "./ContextGenerator";
import { NutritionItem } from "./../logic/nutritionItemLogic";

interface Props {
  children: ReactNode;
}

const {
  context: NutritionItemContext,
  contextProvider: NIContextProvider,
} = contextGeneratorFn<NutritionItem>({
  apiBaseUrl: "http://localhost:4000/nutritionItems",
});

function NutritionItemContextProvider({ children }: Props) {
  return <NIContextProvider>{children}</NIContextProvider>;
}

export { NutritionItemContext };

export default NutritionItemContextProvider;
