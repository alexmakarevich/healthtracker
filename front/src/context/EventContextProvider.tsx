import { Event } from "./../logic/eventLogic";
import { generateContextUseQuery } from "./generateContextUseQuery";

export const {
  ContextProvider: EventProvider,
  useContextDefined: useEventContext,
} = generateContextUseQuery<Event>("http://localhost:4000/events", "Event");
