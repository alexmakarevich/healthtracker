import { NutritionEventDAO } from "../logic/nutritionEventLogic";
import { NutritionItemDAO } from "./../logic/nutritionItemLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: NutritionEventProvider,
  useContextDefined: useNutritionEventContext,
} = generateContext<NutritionEventDAO>(
  "http://localhost:4000/nutritionEvents",
  "NutritionEvent"
);
