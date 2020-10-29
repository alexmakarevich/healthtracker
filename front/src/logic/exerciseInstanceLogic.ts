import { Basic, BASIC_DEFAULTS } from "./sharedLogic";

export interface ExerciseInstance extends Basic {
  exerciseId: string;
  repetitions?: number;
  weightKg?: number;
  durationSeconds?: number;
}

export const exerciseInstanceDefaults: ExerciseInstance = {
  ...BASIC_DEFAULTS,
  exerciseId: "no id yet",
  repetitions: 0,
  weightKg: 0,
  durationSeconds: 0 
};
