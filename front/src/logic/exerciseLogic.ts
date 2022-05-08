import { exerciseTypeDefaults } from "shared";
import { ExerciseTypeContext } from "../context/ExerciseTypeContextProvider";
import { makeUseEntity } from "../hooks/useEntity";

export const useExercise = makeUseEntity({
  contextFn: ExerciseTypeContext.use,
  defaults: exerciseTypeDefaults,
});

export type Exercise = ReturnType<typeof ExerciseTypeContext.use>;
