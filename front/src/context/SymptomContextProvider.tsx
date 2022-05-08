import { SymptomData } from "shared";
import { generateContext } from "./generateContext";

export const SymptomContext = generateContext<SymptomData>(
  "http://localhost:4000/symptoms",
  "Symptom"
);
