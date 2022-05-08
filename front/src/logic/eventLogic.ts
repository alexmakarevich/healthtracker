import { makeUseEntity } from "./../hooks/useEntity";
import { EventContext } from "../context/EventContextProvider";
import { eventDefaults } from "shared";

export const useEvent = makeUseEntity({
  contextFn: EventContext.use,
  defaults: eventDefaults,
});

export type Event = ReturnType<typeof useEvent>;
