import { NutritionItem } from "./../logic/nutritionItemLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: NutritionItemProvider,
  useContextDefined: useNutritionItemContext,
} = generateContext<NutritionItem>(
  "http://localhost:4000/nutritionItems",
  "Nutrition"
);
