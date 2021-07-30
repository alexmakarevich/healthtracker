import { SymptomData } from "shared";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: SymptomProvider,
  useContextDefined: useSymptomContext,
} = generateContext<SymptomData>("http://localhost:4000/symptoms", "Symptom");
