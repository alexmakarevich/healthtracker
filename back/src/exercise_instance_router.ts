const mongoose = require("mongoose");
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let ExerciseInstance = new Schema({
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

const exerciseInstanceRoutes = generateRoutes("ExerciseInstance", ExerciseInstance);

export { exerciseInstanceRoutes };