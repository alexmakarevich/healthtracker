import { ExerciseType } from "../logic/exerciseTypeLogic";
import { generateContextUseQuery } from "./generateContextUseQuery";

export const {
  ContextProvider: ExerciseProvider,
  useContextDefined: useExerciseContext,
} = generateContextUseQuery<ExerciseType>(
  "http://localhost:4000/exerciseTypes",
  "Exercise"
);
