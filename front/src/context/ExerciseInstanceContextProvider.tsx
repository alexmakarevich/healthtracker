import { ExerciseInstance } from "../logic/exerciseInstanceLogic";
import { generateContextUseQuery } from "./generateContextUseQuery";

export const {
  ContextProvider: ExerciseInstanceProviderUseQuery,
  useContextDefined: useExerciseInstanceContextUseQuery,
} = generateContextUseQuery<ExerciseInstance>(
  "http://localhost:4000/exerciseInstances",
  "Exercise Instance"
);
