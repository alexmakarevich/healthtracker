import { exerciseTypeDefaults } from "shared";
import { useExerciseContext } from "../context/ExerciseTypeContextProvider";
import { makeUseEntity } from "../hooks/useEntity";

export const useExercise = makeUseEntity({
  contextFn: useExerciseContext,
  defaults: exerciseTypeDefaults,
});

export type Exercise = ReturnType<typeof useExerciseContext>;
