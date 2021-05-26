import { makeUseEntity } from "./../hooks/useEntity";
import { useEventContext } from "../context/EventContextProvider";
import { eventDefaults } from "shared";

export const useEvent = makeUseEntity({
  contextFn: useEventContext,
  defaults: eventDefaults,
});

export type Event = ReturnType<typeof useEvent>;
