import { makeUseEntity } from "./../hooks/useEntity";
import { useEventContext } from "../context/EventContextProvider";
import { BasicData, eventDefaults } from "shared";

export interface EventData extends BasicData {
  time: string;
  timeStart: string;
  timeEnd: string;
}

// TODO: whenever something gets added to an event, write the eventId as a dependency into that item

export const useEvent = makeUseEntity({
  contextFn: useEventContext,
  defaults: eventDefaults,
});

export type Event = ReturnType<typeof useEvent>;
