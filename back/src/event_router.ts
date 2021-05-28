import { BaseSchema } from "./base_router";
import { Schema } from "mongoose";
import generateRoutes from "./routeGenerator";

const EventSchema = new Schema({
  ...BaseSchema.obj,
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
