import { NutritionEventData } from "shared";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: NutritionEventProvider,
  useContextDefined: useNutritionEventContext,
} = generateContext<NutritionEventData>(
  "http://localhost:4000/nutritionEvents",
  "NutritionEvent"
);
