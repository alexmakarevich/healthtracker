import { ExerciseTypeDAO } from "../logic/exerciseTypeLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: ExerciseProvider,
  useContextDefined: useExerciseContext,
} = generateContext<ExerciseTypeDAO>(
  "http://localhost:4000/exerciseTypes",
  "Exercise"
);
