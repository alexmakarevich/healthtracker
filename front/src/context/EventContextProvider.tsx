import { EventDAO } from "./../logic/eventLogic";
import { generateContext } from "./generateContext";

export const {
  ContextProvider: EventProvider,
  useContextDefined: useEventContext,
} = generateContext<EventDAO>("http://localhost:4000/events", "Event");
