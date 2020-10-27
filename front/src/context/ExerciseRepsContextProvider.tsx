import { ExerciseReps } from "../logic/exerciseRepsLogic";

import { generateDefinedContext } from "./generateDefinedContext";

export const {
  ContextProvider: ExerciseRepsProvider,
  useContextDefined: useRepsContext,
} = generateDefinedContext<ExerciseReps>("http://localhost:4000/exerciseReps");
