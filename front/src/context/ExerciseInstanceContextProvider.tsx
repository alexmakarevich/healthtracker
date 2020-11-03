import { ExerciseInstance } from "../logic/exerciseInstanceLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: ExerciseInstanceProvider,
  useContextDefined: useExerciseInstanceContext,
} = generateContext<ExerciseInstance>(
  "http://localhost:4000/exerciseInstances",
  "Exercise Instance"
);
