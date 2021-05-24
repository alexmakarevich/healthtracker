import { SchemaWithEvent } from "./withEvent";
import { BaseSchema } from "./base_router";
import { isItemFound } from "./utils";
import { Schema } from "mongoose";
import generateRoutes from "./routeGenerator";
import { Exercise } from "./exercise_type_router";

const ExerciseInstanceSchema = new Schema({
  ...BaseSchema.obj,
  ...SchemaWithEvent.obj,
  exerciseId: {
    type: String,
    required: true,
    validate: {
      validator: isItemFound(Exercise.Model),
      message: (props) => props.value + " doesn't exist",
    },
  },
  repetitions: Number,
  weightKg: Number,
  durationSeconds: Number,
});

const modelName = "ExerciseInstance";

const { router, Model } = generateRoutes(modelName, ExerciseInstanceSchema, {
  Get: true,
  Update: true,
  Delete: true,
  GetAll: true,
  Add: true,
});

export const ExerciseInstance = { router, Model };
