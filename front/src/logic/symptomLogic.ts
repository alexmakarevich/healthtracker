import { symptomDefaults } from "shared";
import { useSymptomContext } from "../context/SymptomContextProvider";
import { makeUseEntity } from "../hooks/useEntity";

export const useSymptom = makeUseEntity({
  contextFn: useSymptomContext,
  defaults: symptomDefaults,
});

export type Symptom = ReturnType<typeof useSymptomContext>;
