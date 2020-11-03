import { ExerciseType } from "../logic/exerciseTypeLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: ExerciseProvider,
  useContextDefined: useExerciseContext,
} = generateContext<ExerciseType>(
  "http://localhost:4000/exerciseTypes",
  "Exercise"
);
