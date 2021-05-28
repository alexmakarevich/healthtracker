import { BaseSchema } from "./base_router";
import * as mongoose from "mongoose";
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let ExerciseType = new Schema({
  ...BaseSchema.obj,
  title: {
    type: String,
  },
  measuredFields: {
    type: Object,
  },
  someNumber: {
    type: Number,
  },
});

export const Exercise = generateRoutes("ExerciseType", ExerciseType);
