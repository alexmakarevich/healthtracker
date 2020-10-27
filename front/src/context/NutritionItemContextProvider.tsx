import { NutritionItem } from "./../logic/nutritionItemLogic";
import { generateDefinedContext } from "./generateDefinedContext";

export const {
  ContextProvider: NutritionItemProvider,
  useContextDefined: useNutritionItemContext,
} = generateDefinedContext<NutritionItem>(
  "http://localhost:4000/nutritionItems"
);
