import * as mongoose from "mongoose";
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let Event = new Schema({
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
  // TODO: replace children by< references to eventId in children types
  children: {
    nutritionItemIds: Array,
    exerciseInstanceIds: Array,
  },
  // TODO: probably delete
  items: [{ type: String, id: String }],
});

export const { router, Model } = generateRoutes("Event", Event);
