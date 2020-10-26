import { ExerciseType } from "../logic/exerciseTypeLogic";
import { generateDefinedContext } from "./ContextGeneratorDefined";

export const {
  ContextProvider: ExerciseTypeProvider,
  useContextDefined: useExerciseContext,
} = generateDefinedContext<ExerciseType>("http://localhost:4000/exerciseTypes");
