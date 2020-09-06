import { nutritionItemDefaults } from "./nutritionItemLogic";
import { Children } from "react";
import { Basic } from "./sharedLogic";

export interface Event extends Basic {
  time: string;
  timeStart: string;
  timeEnd: string;
  children: {
    nutritionItemIds: string[];
  };
}

export const eventDefaults: Event = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  time: new Date().toISOString(),
  timeStart: new Date().toISOString(),
  timeEnd: new Date().toISOString(),
  children: {
    nutritionItemIds: [],
  },
};

export const eventLogic = {
  addNI: (event: Event, niId: string) => {
    const newNiIds = [...event.children.nutritionItemIds, niId];
    const newEvent = {
      ...event,
      children: {
        ...event.children,
        nutritionItemIds: newNiIds,
      },
    };
    return newEvent;
  },
  removeNI: (event: Event, niId: string) => {
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
  },
};
