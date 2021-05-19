import { SchemaWithEvent } from "./withEvent";
import { Nutrition } from "./nutrition_item-router";
import { BaseSchema } from "./base_router";
import { validateIsItemFound } from "./utils";
import { Schema } from "mongoose";
import generateRoutes from "./routeGenerator";

const NutritionEventSchema = new Schema({
  ...BaseSchema.obj,
  ...SchemaWithEvent.obj,
  nutritionId: {
    type: String,
    required: true,
    validate: validateIsItemFound(
      Nutrition.Model as any /** TODO: derive type from generic */
    ),
  },
});

const modelName = "NutritionEvents";

export const NutritionEvent = generateRoutes(modelName, NutritionEventSchema, {
  Get: true,
  Update: true,
  Delete: true,
  GetAll: true,
  Add: true,
});
