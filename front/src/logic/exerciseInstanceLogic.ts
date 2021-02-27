import { Basic, BASIC_DEFAULTS } from "./sharedLogic";

export interface ExerciseInstance extends Basic {
  exerciseId: string;
  eventId?: string;
  repetitions?: number;
  weightKg?: number;
  durationSeconds?: number;
}

export const exerciseInstanceDefaults: ExerciseInstance = {
  ...BASIC_DEFAULTS,
  exerciseId: "no id yet",
};
