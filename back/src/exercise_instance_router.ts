import { SchemaWithEvent } from "./withEvent";
import { BaseSchema } from "./base_router";
import { isItemFound } from "./utils";
import { Schema } from "mongoose";
import generateRoutes, { RouteEnd } from "./routeGenerator";
import { Exercise } from "./exercise_type_router";

const ExerciseInstance = new Schema({
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

const { router: exerciseInstanceRoutes, Model } = generateRoutes(
  modelName,
  ExerciseInstance,
  { Get: true, Update: true, Delete: true, GetAll: true, Add: true }
);

exerciseInstanceRoutes.route(RouteEnd.GetAll).get(function (_req, res) {
  Model.find(function (err, items) {
    if (err) {
      res.status(400).send("Server error: " + err);
    } else {
      res.status(200).json(items);
    }
  });
});

export { exerciseInstanceRoutes };
