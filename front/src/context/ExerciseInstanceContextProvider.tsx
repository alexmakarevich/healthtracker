import { ExerciseInstance } from "../logic/exerciseInstanceLogic";

import { generateDefinedContext } from "./generateDefinedContext";

export const {
  ContextProvider: ExerciseInstanceProvider,
  useContextDefined: useExerciseInstanceContext,
} = generateDefinedContext<ExerciseInstance>(
  "http://localhost:4000/exerciseInstances"
);
