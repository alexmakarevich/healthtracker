import { Event } from "./event_router";
import { Nutrition } from "./nutrition_item-router";
import { NutritionEvent } from "./nutrition_event_router";
import { Exercise } from "./exercise_type_router";
import { exerciseInstanceRoutes } from "./exercise_instance_router";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as mongoose from "mongoose";

const app = express();

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// make sure to create the db with the name below (after last slash).
// in console type 'mongo' then 'use <name of db>
mongoose.connect("mongodb://127.0.0.1:27017/tracker", {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully.");
});

app.use("/nutritionItems", Nutrition.router);
app.use("/nutritionEvents", NutritionEvent.router);
app.use("/events", Event.router);
app.use("/exerciseTypes", Exercise.router);
app.use("/exerciseInstances", exerciseInstanceRoutes);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
