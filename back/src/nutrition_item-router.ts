const mongoose = require("mongoose");
import generateRoutes from "./routeGenerator";

const Schema = mongoose.Schema;
let NutririonItem = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  ingredientIds: {
    type: Array,
  },
});

const nutritionItemRoutes = generateRoutes("NutritionItem", NutririonItem);

export { nutritionItemRoutes };
