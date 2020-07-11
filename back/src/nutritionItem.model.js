const mongoose = require("mongoose");

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

const Model = mongoose.model("NutritionItem", NutririonItem);

module.exports = Model;
