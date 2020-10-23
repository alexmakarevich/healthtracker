import { ExerciseReps } from "../logic/exerciseRepsLogic";
import { ExerciseType } from "../logic/exerciseTypeLogic";
import contextGeneratorFn from "./ContextGenerator";

export const {
  context: ExerciseRepsContext,
  contextProvider: ExerciseRepsProvider,
} = contextGeneratorFn<ExerciseReps>({
  apiBaseUrl: "http://localhost:4000/exerciseReps",
});