import { SymptomEventData, symptomEventDefaults } from "shared";
import { EventContext } from "../context/EventContextProvider";
import { SymptomContext } from "../context/SymptomContextProvider";
import { SymptomEventContext } from "../context/SymptomEventContextProvider";
import { makeUseEntity, UseEntityProps } from "../hooks/useEntity";

export const useSymptomEvent = (props: UseEntityProps<SymptomEventData>) => {
  const base = makeUseEntity({
    contextFn: SymptomEventContext.use,
    defaults: symptomEventDefaults,
  })(props);

  const { data } = base;

  const events = EventContext.use();
  const symptoms = SymptomContext.use();

  const eventData = events.getOneFromContext(data.eventId);
  const symptomData = symptoms.getOneFromContext(data.symptomId);

  return { ...base, eventData, symptomData };
};

export type SymptomEvent = ReturnType<typeof SymptomEventContext.use>;
