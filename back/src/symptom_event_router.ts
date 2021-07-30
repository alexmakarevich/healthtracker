import { BaseSchema } from "./base_router";
import { validateIsItemFound } from "./utils";
import { Schema } from "mongoose";
import generateRoutes from "./routeGenerator";
import { Symptom } from "./symptom_router";
import { SchemaWithEvent } from "./withEvent";

const SymptomEventSchema = new Schema({
  ...BaseSchema.obj,
  ...SchemaWithEvent.obj,
  symptomId: {
    type: String,
    required: true,
    validate: validateIsItemFound(Symptom.Model),
  },
  strength: Number,
});

export const SymptomEvent = generateRoutes(
  "SymptomEvents",
  SymptomEventSchema,
  {
    Get: true,
    Update: true,
    Delete: true,
    GetAll: true,
    Add: true,
  }
);
