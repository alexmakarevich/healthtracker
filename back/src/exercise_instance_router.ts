import { isItemFound } from "./utils";
import { Schema } from "mongoose";
import generateRoutes, { RouteEnd } from "./routeGenerator";
import { Exercise } from "./exercise_type_router";
import * as Event from "./event_router";

const ExerciseInstance = new Schema({
  createdOn: {
    type: String,
    required: true,
  },
  lastModifiedOn: {
    type: String,
    required: true,
  },
  exerciseId: {
    type: String,
    required: true,
    validate: {
      validator: isItemFound(Exercise.Model),
      message: (props) => props.value + " doesn't exist",
    },
  },
  eventId: {
    type: String,
    required: true,
    validate: {
      validator: isItemFound(Event.Model),
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

// exerciseInstanceRoutes.route(RouteEnd.Add).post(function (req, res) {
//   const item = new Model(req.body);

//   item
//     .save()
//     .then((item) => {
//       res.status(200).json(item);
//     })
//     .catch((err) => {
//       res.status(400).send(`adding new ${modelName} failed - ${err}`);
//     });
// });

export { exerciseInstanceRoutes };
