import contextGeneratorFn from "./ContextGenerator";
import { Event } from "./../logic/eventLogic";

export const {
  context: EventContext,
  contextProvider: EventProvider,
} = contextGeneratorFn<Event>({
  apiBaseUrl: "http://localhost:4000/events",
});