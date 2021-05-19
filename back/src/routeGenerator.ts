import * as express from "express";
import * as mongoose from "mongoose";

/** mind the ordering of routes, as it affects pattern matching */
export const RouteEnd = {
  GetAll: "/",
  Get: "/:id",
  Update: "/update/:id",
  Delete: "/delete/:id",
  Add: "/add",
} as const;

function generateRoutes<SchemaType = any>(
  modelName: string,
  schema: mongoose.Schema<SchemaType>,
  includeRoutes: Record<keyof typeof RouteEnd, boolean> = {
    GetAll: true,
    Get: true,
    Update: true,
    Delete: true,
    Add: true,
  }
) {
  const Model = mongoose.model<SchemaType>(modelName, schema);

  let router = express.Router();

  includeRoutes.GetAll &&
    router.route(RouteEnd.GetAll).get(function (_req, res) {
      Model.find(function (err, items) {
        if (err) {
          res.status(400).send("Server error: " + err);
        } else {
          res.status(200).json(items);
        }
      });
    });

  includeRoutes.Get &&
    router.route(RouteEnd.Get).get(function (req, res) {
      let id = req.params.id;
      Model.findById(id, function (err, item) {
        if (err) {
          res.status(400).send("Server error: " + err);
        } else if (!item) {
          res.status(400).send("could not find item with id " + req.params.id);
        } else {
          res.status(200).json(item);
        }
      });
    });

  includeRoutes.Update &&
    router.route(RouteEnd.Update).post(function (req, res) {
      Model.findById(req.params.id, function (err, item) {
        if (!item)
          res
            .status(404)
            .send(
              `update of ${modelName} with ID: "${req.params.id}" failed. ID not found.`
            );
        else console.log("before update", JSON.stringify(item));
        item = Object.assign(item, req.body);
        console.log("update", JSON.stringify(item));

        item
          .save()
          .then((item) => {
            res.json({ result: "updated", request: req.body, item });
          })
          .catch((err) => {
            res
              .status(400)
              .send(
                `update of ${modelName} with ID: "${req.params.id}" failed. ${err}`
              );
          });
      });
    });

  includeRoutes.Delete &&
    router.route(RouteEnd.Delete).delete(function (req, res) {
      Model.findByIdAndDelete(req.params.id, null, function (err, item) {
        if (err) {
          console.log(err);
          res.status(400).send("Server error: " + err);
        } else if (!item) {
          res.status(400).send("could not find item with id " + req.params.id);
        } else {
          res.status(200).json(`item ${req.params.id} deleted!`);
        }
      });
    });

  includeRoutes.Add &&
    router.route(RouteEnd.Add).post(function (req, res) {
      let item = new Model(req.body);
      item
        .save()
        .then((item) => {
          res.status(200).json(item);
        })
        .catch((err) => {
          res.status(400).send(`adding new ${modelName} failed - ${err}`);
        });
    });

  return { router, Model };
}

export default generateRoutes;
