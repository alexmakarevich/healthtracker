import { PartialPartial } from "./../utils/utilTypes";
export interface BasicData {
    _id: string;
    createdOn: string;
    lastModifiedOn: string;
    _v?: number;
}
export declare const BASIC_DEFAULTS: {
    readonly _id: "not yet saved";
    readonly createdOn: string;
    readonly lastModifiedOn: string;
    readonly _v: -1;
};
/** utility type to easily optionalize basic properties in types extending Basic */
export declare type ExceptAutoSetBasics<T extends BasicData> = PartialPartial<T, "_id" | "createdOn" | "lastModifiedOn" | "_v">;
export interface EventData extends BasicData {
    time: string;
    timeStart: string;
    timeEnd: string;
}
export declare const eventDefaults: EventData;
export interface ExerciseInstanceData extends BasicData {
    exerciseId: string;
    eventId: string;
    repetitions?: number;
    weightKg?: number;
    durationSeconds?: number;
}
export declare const NO_EVENT_ID = "NO_EVENT_ID";
export declare const exerciseInstanceDefaults: ExerciseInstanceData;
export interface ExerciseTypeData extends BasicData {
    title: string;
}
export declare const exerciseTypeDefaults: ExerciseTypeData;
export interface NutritionEventData extends BasicData {
    eventId: string;
    nutritionId: string;
}
export declare const nutritionEventDefaults: NutritionEventData;
export interface NutritionItemData extends BasicData {
    title: string;
    ingredientIds: NutritionItemData["_id"][];
    ingredientIdsFlat: NutritionItemData["_id"][];
}
export declare const nutritionItemDefaults: NutritionItemData;
export interface SymptomData extends BasicData {
    title: string;
}
export declare const symptomDefaults: ExerciseTypeData;
export interface SymptomEventData extends BasicData {
    eventId: string;
    symptomId: string;
    strength: number;
}
export declare const symptomEventDefaults: SymptomEventData;
