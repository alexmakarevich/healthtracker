import { Schema } from "mongoose";

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
