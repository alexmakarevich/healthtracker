const mongoose = require("mongoose");
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let Event = new Schema({
  createdOn: {
    type: String,
  },
  lastModifiedOn: {
    type: String,
  },
  timeStart: {
    type: String,
  },
  timeEnd: {
    type: String,
  },
});

const eventRoutes = generateRoutes("Event", Event);

export { eventRoutes };
