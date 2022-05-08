import { symptomDefaults } from "shared";
import { SymptomContext } from "../context/SymptomContextProvider";
import { makeUseEntity } from "../hooks/useEntity";

export const useSymptom = makeUseEntity({
  contextFn: SymptomContext.use,
  defaults: symptomDefaults,
});

export type Symptom = ReturnType<typeof SymptomContext.use>;
