import { ExerciseType } from "../logic/exerciseTypeLogic";
import contextGeneratorFn from "./ContextGenerator";

export const {
  context: ExerciseTypeContext,
  contextProvider: ExerciseTypeProvider,
} = contextGeneratorFn<ExerciseType>({
  apiBaseUrl: "http://localhost:4000/exerciseTypes",
});