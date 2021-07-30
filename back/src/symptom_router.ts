import { BaseSchema } from "./base_router";
import { Schema } from "mongoose";
import generateRoutes from "./routeGenerator";

let SymptomType = new Schema({
  ...BaseSchema.obj,
  title: {
    type: String,
  },
});

export const Symptom = generateRoutes("Symptom", SymptomType);
