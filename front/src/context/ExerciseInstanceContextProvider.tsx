import { ExerciseInstanceData } from "shared";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: ExerciseInstanceProvider,
  useContextDefined: useExerciseInstanceContext,
} = generateContext<ExerciseInstanceData>(
  "http://localhost:4000/exerciseInstances",
  "Exercise Instance"
);
