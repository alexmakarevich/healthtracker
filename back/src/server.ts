import { SymptomEvent } from "./symptom_event_router";
import { Event } from "./event_router";
import { Nutrition } from "./nutrition_item-router";
import { NutritionEvent } from "./nutrition_event_router";
import { Exercise } from "./exercise_type_router";
import { ExerciseInstance } from "./exercise_instance_router";
import { Symptom } from "./symptom_router";
import * as express from "express";
import * as cors from "cors";
import * as mongoose from "mongoose";

async function server() {
  const app = express();

  const PORT = 4000;

  app.use(cors());
  app.use(express.json());

  // make sure to create the db with the name below (after last slash) - in console type `mongo` then `use <name of db>`
  // make sure your main mongo instance runs on 127.0.0.1:27017, and your replica is on 127.0.0.1:27018

  await mongoose.connect("mongodb://127.0.0.1:27017,127.0.0.1:27018/tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.use("/nutritionItems", Nutrition.router);
  app.use("/nutritionEvents", NutritionEvent.router);
  app.use("/events", Event.router);
  app.use("/exerciseTypes", Exercise.router);
  app.use("/exerciseInstances", ExerciseInstance.router);
  app.use("/symptoms", Symptom.router);
  app.use("/symptomEvents", SymptomEvent.router);

  app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
  });
}

server().catch((err) => console.log({ err }));
