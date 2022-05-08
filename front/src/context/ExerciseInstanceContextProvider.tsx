import { ExerciseInstanceData } from "shared";
import { generateContext } from "./generateContext";

export const ExerciseInstanceContext = generateContext<ExerciseInstanceData>(
  "http://localhost:4000/exerciseInstances",
  "Exercise Instance"
);
