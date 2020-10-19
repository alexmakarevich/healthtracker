export interface Basic {
  _id: string;
  createdOn: string;
  lastModifiedOn: string ;
  _v?: number ;
}

export const BASIC_DEFAULTS = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
}