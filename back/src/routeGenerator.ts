import * as express from "express";
const mongoose = require("mongoose");

// model should be of type express model, but not sure how to import it
function generateRoutes(modelName: string, schema: any) {
  const Model = mongoose.model(modelName, schema);

  let router = express.Router();

  router.route("/").get(function (req, res) {
    Model.find(function (err, items) {
      if (err) {
        res.status(400).send("Server error: "+err)                
      } else {
        res.status(200).json(items);
      }
    });
  });

  router.route("/:id").get(function (req, res) {
    let id = req.params.id;
    Model.findById(id, function (err, item) {
    if (err) {
      res.status(400).send("Server error: "+err)                
    } else if (!item) {
      res.status(400).send("could not find item with id " + req.params.id )          
    } else {
      res.status(200).json(item)
    }
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
    // TODO: FIX - if a bad string is passed, there's an internal error that is not visible and does not return anything
    Model.findByIdAndDelete(req.params.id, function (err, item) {
      if (err) {
        console.log(err);
        res.status(400).send("Server error: "+err)          
      } else if (!item) {
        // res
        //   .status(404)
        //   .send(`item not found, there's no id ${req.params.id} in the db.`);
        //   console.log("item not found - cannot delete by", req.params.id);
        res.status(400).send("could not find item with id " + req.params.id )          
      } else {
        res.status(200).json(`item ${req.params.id} deleted!`);
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
