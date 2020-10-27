import { Event } from "./../logic/eventLogic";
import { generateDefinedContext } from "./generateDefinedContext";

export const {
  ContextProvider: EventProvider,
  useContextDefined: useEventContext,
} = generateDefinedContext<Event>("http://localhost:4000/events");
