import { ExerciseInstance } from "../logic/exerciseInstanceLogic";

import { generateDefinedContext } from "./generateDefinedContext";

export const {
  ContextProvider: ExerciseRepsProvider,
  useContextDefined: useRepsContext,
} = generateDefinedContext<ExerciseInstance>(
  "http://localhost:4000/exerciseInstances"
);
