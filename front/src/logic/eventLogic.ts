import { Basic } from "./sharedLogic";

export interface Event extends Basic {
  timeStart: string;
  timeEnd: string;
  children: {
    nutritionItemIds: string[];
  };
}

export const eventsDefaults: Event = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  timeStart: new Date().toISOString(),
  timeEnd: new Date().toISOString(),
  children: {
    nutritionItemIds: [],
  },
};
