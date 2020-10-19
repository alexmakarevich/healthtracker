const mongoose = require("mongoose");
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let ExerciseType = new Schema({
  createdOn: {
    type: String,
  },
  lastModifiedOn: {
    type: String,
  },
  title: {
    type: String,
  },
  measuredFields: {
    type: Object
  }
});

const exerciseTypeRoutes = generateRoutes("ExerciseType", ExerciseType);

export { exerciseTypeRoutes };
