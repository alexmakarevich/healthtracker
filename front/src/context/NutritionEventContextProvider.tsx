import { NutritionEventData } from "shared";
import { generateContext } from "./generateContext";

export const NutritionEventContext = generateContext<NutritionEventData>(
  "http://localhost:4000/nutritionEvents",
  "NutritionEvent"
);
