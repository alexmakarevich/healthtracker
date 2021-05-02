import { makeUseEntity } from "./../hooks/useEntity";
import { updateObject } from "./../common/updateObject";
import { Basic } from "./sharedLogic";
import { useEventContext } from "../context/EventContextProvider";

export interface EventDAO extends Basic {
  time: string;
  timeStart: string;
  timeEnd: string;
  children: {
    nutritionItemIds: string[];
    exerciseInstanceIds: string[];
  };
  // TODO: probably delete
  items: { type: EventItemTypes; id: string }[];
}

// TODO: probably delete
export enum EventItemTypes {
  NUTRITION = "nutrition",
  EXERCISE = "exercise",
}

// whenever something gets added to an event, write the eventId as a dependency into that item

export const eventDefaults: EventDAO = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  time: new Date().toISOString(),
  timeStart: new Date().toISOString(),
  timeEnd: new Date().toISOString(),
  children: {
    nutritionItemIds: [],
    exerciseInstanceIds: [],
  },
  // TODO: probably delete
  items: [],
};

/**
 * @deprecated
 * this logic moves to children (with possible link duplication built in the future)
 * TODO: remove this entirely
 */
export const eventLogic = (event: EventDAO) => {
  const updateEvent = updateObject(event);
  const updateChildren = updateObject(event.children);
  const addNI = (niId: string) => {
    const newNiIds = [...event.children.nutritionItemIds, niId];
    const newEvent = {
      ...event,
      children: {
        ...event.children,
        nutritionItemIds: newNiIds,
      },
    };
    return newEvent;
  };
  const removeNI = (niId: string) => {
    const newNiIds = event.children.nutritionItemIds.filter(
      (id) => id !== niId
    );
    const newEvent = {
      ...event,
      children: {
        ...event.children,
        nutritionItemIds: newNiIds,
      },
    };
    return newEvent;
  };

  const addExercise = (exerciseInstanceid: string) => {
    const newChildren = updateChildren({
      exerciseInstanceIds: [
        ...event.children.exerciseInstanceIds,
        exerciseInstanceid,
      ],
    });
    return updateEvent({ children: newChildren });
  };

  const removeExercise = (exerciseInstanceid: string) => {
    const newChildren = updateChildren({
      exerciseInstanceIds: event.children.exerciseInstanceIds.filter(
        (id) => id !== exerciseInstanceid
      ),
    });
    return updateEvent({ children: newChildren });
  };

  return { addNI, removeNI, addExercise, removeExercise };
};

export const useEvent = makeUseEntity({
  contextFn: useEventContext,
  defaults: eventDefaults,
});
