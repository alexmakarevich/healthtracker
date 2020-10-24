import { Basic } from "./sharedLogic";

export interface ExerciseType extends Basic {
  title: string;
  someNumber: number;
}

export const exerciseTypeDefaults: ExerciseType = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  title: "",
  someNumber: 0
};
