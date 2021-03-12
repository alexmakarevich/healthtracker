// some tutorials
// https://medium.com/codingthesmartway-com-blog/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-2-637f337e5d61
// https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66
// https://dev.to/aurelkurtula/building-a-restful-api-with-express-and-mongodb--3mmh
import { nutritionItemRoutes } from "./nutrition_item-router";
import * as Event from "./event_router";
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

// app.use("/todos", todoRoutes);
app.use("/nutritionItems", nutritionItemRoutes);
app.use("/events", Event.router);
app.use("/exerciseTypes", Exercise.router);
app.use("/exerciseInstances", exerciseInstanceRoutes);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
