import { SymptomEventData } from "shared";
import { generateContext } from "./generateContext";

export const SymptomEventContext = generateContext<SymptomEventData>(
  "http://localhost:4000/symptomEvents",
  "Symptom Event"
);
