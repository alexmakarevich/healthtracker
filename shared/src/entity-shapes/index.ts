import { PartialPartial } from "./../utils/utilTypes";

export interface BasicData {
  _id: string;
  createdOn: string;
  lastModifiedOn: string;
  _v?: number;
}

export const BASIC_DEFAULTS = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
} as const;

/** utility type to easily optionalize basic properties in types extending Basic */
export type ExceptAutoSetBasics<T extends BasicData> = PartialPartial<
  T,
  "_id" | "createdOn" | "lastModifiedOn" | "_v"
>;

export interface EventData extends BasicData {
  time: string;
  timeStart: string;
  timeEnd: string;
}

// TODO: whenever something gets added to an event, write the eventId as a dependency into that item

export const eventDefaults: EventData = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  time: new Date().toISOString(),
  timeStart: new Date().toISOString(),
  timeEnd: new Date().toISOString(),
};

export interface ExerciseInstanceData extends BasicData {
  exerciseId: string;
  eventId: string;
  repetitions?: number;
  weightKg?: number;
  durationSeconds?: number;
}

export const exerciseInstanceDefaults: ExerciseInstanceData = {
  ...BASIC_DEFAULTS,
  exerciseId: "no id yet",
  eventId: "no id yet",
};

export interface ExerciseTypeData extends BasicData {
  title: string;
  someNumber: number;
}

export const exerciseTypeDefaults: ExerciseTypeData = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  title: "",
  someNumber: 0,
};

export interface NutritionEventData extends BasicData {
  eventId: string;
  nutritionId: string;
}

export const nutritionEventDefaults: NutritionEventData = {
  ...BASIC_DEFAULTS,
  eventId: "",
  nutritionId: "",
};

export interface NutritionItemData extends BasicData {
  title: string;
  ingredientIds: NutritionItemData["_id"][];
  ingredientIdsFlat: NutritionItemData["_id"][];
}

export const nutritionItemDefaults: NutritionItemData = {
  ...BASIC_DEFAULTS,
  title: "",
  ingredientIds: [],
  ingredientIdsFlat: [],
};
