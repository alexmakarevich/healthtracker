const mongoose = require("mongoose");
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let ExerciseInstance = new Schema({
  createdOn: { type: String },
  lastModifiedOn: { type: String },
  exerciseId: { type: String, },
  eventId: String,
  repetitions: { type: Number },
  weightKg: Number,
  durationSeconds: Number,
});

const exerciseInstanceRoutes = generateRoutes("ExerciseInstance", ExerciseInstance);

export { exerciseInstanceRoutes };