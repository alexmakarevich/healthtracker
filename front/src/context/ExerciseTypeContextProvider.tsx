import { ExerciseTypeData } from "shared";
import { generateContext } from "./generateContext";

export const ExerciseTypeContext = generateContext<ExerciseTypeData>(
  "http://localhost:4000/exerciseTypes",
  "Exercise"
);
