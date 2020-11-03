import { NutritionItem } from "./../logic/nutritionItemLogic";
import { generateContextUseQuery } from "./generateContextUseQuery";

export const {
  ContextProvider: NutritionItemProvider,
  useContextDefined: useNutritionItemContext,
} = generateContextUseQuery<NutritionItem>(
  "http://localhost:4000/nutritionItems",
  "Nutrition"
);
