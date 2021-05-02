import { isItemFound } from "./utils";
import { Schema } from "mongoose";
import { Event } from "./event_router";

export const SchemaWithEvent = new Schema({
  eventId: {
    type: String,
    required: true,
    validate: {
      validator: isItemFound(Event.Model),
      message: (props) => props.value + " doesn't exist",
    },
  },
});
