import { Event } from "./../logic/eventLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: EventProvider,
  useContextDefined: useEventContext,
} = generateContext<Event>("http://localhost:4000/events", "Event");
