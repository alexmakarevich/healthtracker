import { Basic } from "./sharedLogic";

export interface ExerciseTypeDAO extends Basic {
  title: string;
  someNumber: number;
}

export const exerciseTypeDefaults: ExerciseTypeDAO = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  title: "",
  someNumber: 0,
};
