import { Schema } from "mongoose";

export interface Basic {
  _id: string;
  createdOn: string;
  lastModifiedOn: string;
  _v?: number;
}

export const BaseSchema = new Schema({
  createdOn: {
    type: String,
    required: true,
  },
  lastModifiedOn: {
    type: String,
    required: true,
  },
});
