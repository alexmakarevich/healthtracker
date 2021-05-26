import { Schema } from "mongoose";
import generateRoutes from "./routeGenerator";

const EventSchema = new Schema({
  createdOn: {
    type: String,
  },
  lastModifiedOn: {
    type: String,
  },
  time: {
    type: String,
  },
  isInterval: {
    type: Boolean,
  },
  timeStart: {
    type: String,
  },
  timeEnd: {
    type: String,
  },
});

export const Event = generateRoutes("Event", EventSchema);
