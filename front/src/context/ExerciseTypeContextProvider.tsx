import { ExerciseTypeData } from "shared";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: ExerciseProvider,
  useContextDefined: useExerciseContext,
} = generateContext<ExerciseTypeData>(
  "http://localhost:4000/exerciseTypes",
  "Exercise"
);
