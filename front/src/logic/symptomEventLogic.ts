import { SymptomEventData, symptomEventDefaults } from "shared";
import { useEventContext } from "../context/EventContextProvider";
import { useSymptomContext } from "../context/SymptomContextProvider";
import { useSymptomEventContext } from "../context/SymptomEventContextProvider";
import { makeUseEntity, UseEntityProps } from "../hooks/useEntity";

export const useSymptomEvent = (props: UseEntityProps<SymptomEventData>) => {
  const base = makeUseEntity({
    contextFn: useSymptomEventContext,
    defaults: symptomEventDefaults,
  })(props);

  const { data } = base;

  const EventContext = useEventContext();
  const SymptomContext = useSymptomContext();

  const eventData = EventContext.getOneFromContext(data.eventId);
  const symptomData = SymptomContext.getOneFromContext(data.symptomId);

  return { ...base, eventData, symptomData };
};

export type SymptomEvent = ReturnType<typeof useSymptomEventContext>;
