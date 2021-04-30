import { NutritionItemDAO } from "./../logic/nutritionItemLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: NutritionItemProvider,
  useContextDefined: useNutritionItemContext,
} = generateContext<NutritionItemDAO>(
  "http://localhost:4000/nutritionItems",
  "Nutrition"
);
