import { Basic, BASIC_DEFAULTS } from "./sharedLogic";

export interface ExerciseReps extends Basic {
  exerciseId: string;
  repetitions?: number;
  weightKg?: number;
  durationSeconds?: number;
}

export const exerciseRepsDefaults: ExerciseReps = {
  ...BASIC_DEFAULTS,
  exerciseId: "no id yet", 
};
