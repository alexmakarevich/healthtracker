const mongoose = require("mongoose");
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let ExerciseEvent = new Schema({
  createdOn: {
    type: String,
  },
  lastModifiedOn: {
    type: String,
  },
  exerciseId: {
    type: String,
  },
  repetitions: {
    type: Number,
  },
  weightKg: {
    type: Number,
  },
  durationSeconds: {
    type: Number
  }

});

const exerciseEventRoutes = generateRoutes("ExerciseEvent", ExerciseEvent);

export { exerciseEventRoutes };