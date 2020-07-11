const express = require("express");
const nutritionItemRoutes = express.Router();
let NutritionItem = require("./nutritionItem.model");

nutritionItemRoutes.route("/").get(function (req, res) {
  NutritionItem.find(function (err, nutritionItems) {
    if (err) {
      console.log(err);
    } else {
      res.json(nutritionItems);
    }
  });
});

nutritionItemRoutes.route("/:id").get(function (req, res) {
  let id = req.params.id;
  NutritionItem.findById(id, function (err, nutritionItem) {
    res.json(nutritionItem);
  });
});

nutritionItemRoutes.route("/update/:id").post(function (req, res) {
  NutritionItem.findById(req.params.id, function (err, nutritionItem) {
    if (!nutritionItem) res.status(404).send("data is not found.");
    else nutritionItem.title = req.body.title;
    nutritionItem.id = req.body.id;
    nutritionItem.ingredientIds = req.body.ingredientIds;
    nutritionItem
      .save()
      .then((nutritionItem) => {
        res.json("nutrition item updated!");
      })
      .catch((err) => {
        res.status(400).send("Update not possible");
      });
  });
});

nutritionItemRoutes.route("/delete/:id").delete(function (req, res) {
  NutritionItem.findByIdAndDelete(req.params.id, function (err, nutritionItem) {
    if (err) {
      console.log(err);
    } else if (!nutritionItem) {
      res
        .status(404)
        .send(`item not found, there's no id ${req.params.id} in the db.`);
    } else {
      res.json("nutrition item deleted!");
    }
  });
});

nutritionItemRoutes.route("/add").post(function (req, res) {
  let nutritionItem = new NutritionItem(req.body);
  nutritionItem
    .save()
    .then((nutritionItem) => {
      res
        .status(200)
        .json({ nutritionItem: "nutrition item added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new nutrition item failed");
    });
});

module.exports = nutritionItemRoutes;
