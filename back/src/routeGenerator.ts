import * as express from "express";
const mongoose = require("mongoose");

// model should be of type express model, but not sure how to import it
function generateRoutes(modelName: string, schema: any) {
  const Model = mongoose.model(modelName, schema);

  let router = express.Router();

  router.route("/").get(function (req, res) {
    Model.find(function (err, items) {
      if (err) {
        console.log(err);
      } else {
        res.json(items);
      }
    });
  });

  router.route("/:id").get(function (req, res) {
    let id = req.params.id;
    Model.findById(id, function (err, item) {
      res.json(item);
    });
  });

  router.route("/update/:id").post(function (req, res) {
    Model.findById(req.params.id, function (err, item) {
      if (!item) res.status(404).send("data not found - 404.");
      else item = Object.assign(item, req.body);
      item
        .save()
        .then((item) => {
          res.json({ result: "updated", request: req.body, item: item });
        })
        .catch((err) => {
          res.status(400).send("update failed - 400");
        });
    });
  });

  router.route("/delete/:id").delete(function (req, res) {
    Model.findByIdAndDelete(req.params.id, function (err, item) {
      if (err) {
        console.log(err);
      } else if (!item) {
        res
          .status(404)
          .send(`item not found, there's no id ${req.params.id} in the db.`);
      } else {
        res.json(`item ${req.params.id} deleted!`);
      }
    });
  });

  router.route("/add").post(function (req, res) {
    let item = new Model(req.body);
    item
      .save()
      .then((item) => {
        res.status(200).json({ result: "item added successfully", item: item });
      })
      .catch((err) => {
        res.status(400).send("adding new nutrition item failed");
      });
  });

  return router;
}

export default generateRoutes;
