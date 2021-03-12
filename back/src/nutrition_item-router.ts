import * as mongoose from "mongoose";
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let NutririonItem = new Schema({
  createdOn: {
    type: String,
  },
  lastModifiedOn: {
    type: String,
  },
  title: {
    type: String,
  },
  ingredientIds: {
    type: Array,
  },
});

const { router: nutritionItemRoutes } = generateRoutes(
  "NutritionItem",
  NutririonItem
);

export { nutritionItemRoutes };
