import { EventData } from "shared";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: EventProvider,
  useContextDefined: useEventContext,
} = generateContext<EventData>("http://localhost:4000/events", "Event");
