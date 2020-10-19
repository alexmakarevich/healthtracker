import contextGeneratorFn from "./ContextGenerator";
import { NutritionItem } from "./../logic/nutritionItemLogic";

export const {
  context: NutritionItemContext,
  contextProvider: NutritionItemProvider,
} = contextGeneratorFn<NutritionItem>({
  apiBaseUrl: "http://localhost:4000/nutritionItems",
});