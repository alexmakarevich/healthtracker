import { ExerciseType } from "../logic/exerciseTypeLogic";
import { generateDefinedContext } from "./generateDefinedContext";

export const {
  ContextProvider: ExerciseTypeProvider,
  useContextDefined: useExerciseContext,
} = generateDefinedContext<ExerciseType>("http://localhost:4000/exerciseTypes");
