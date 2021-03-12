import { PartialPartial } from "../utils/utils";

export interface Basic {
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
};

/** uitility type to easily optionalize basic properties in types extending Basic */
export type ExceptAutoSetBasics<T extends Basic> = PartialPartial<
  T,
  "_id" | "createdOn" | "lastModifiedOn"
>;

// TOOO: separate DAOs / create-ready items from proper useable items

// function makeEntityWithActions <T extends WithId>(entity: T, update: ContextProps<T>["update"], delete:) {

// }
