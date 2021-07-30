import { SymptomEventData } from "shared";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: SymptomEventProvider,
  useContextDefined: useSymptomEventContext,
} = generateContext<SymptomEventData>(
  "http://localhost:4000/symptomEvents",
  "Symptom Event"
);
