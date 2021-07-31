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
    router.route(RouteEnd.GetAll).get(async (_req, res) => {
      try {
        const allItems = await Model.find();
        res.status(200).json(allItems);
      } catch (error) {
        res.status(400).send("Server error: " + error);
      }
    });

  includeRoutes.Get &&
    router.route(RouteEnd.Get).get(async (req, res) => {
      const id = req.params.id;
      try {
        const item = await Model.findById(id);
        res.status(200).json(item);
      } catch (error) {
        res.status(400).send("Server error: " + error);
      }
    });

  includeRoutes.Update &&
    router.route(RouteEnd.Update).post(async (req, res) => {
      const id = req.params.id;
      try {
        const item = await Model.findById(id);
        await item.updateOne(req.body);
        const updated = await Model.findById(id);
        res.status(200).json(updated);
      } catch (error) {
        res.status(400).send("Server error: " + error);
      }
    });

  includeRoutes.Delete &&
    router.route(RouteEnd.Delete).delete(async (req, res) => {
      const id = req.params.id;
      try {
        const item = await Model.findById(id);
        await item.delete();
        res.status(200).json(`item ${req.params.id} deleted!`);
      } catch (error) {
        res.status(400).send("Server error: " + error);
      }
    });

  includeRoutes.Add &&
    router.route(RouteEnd.Add).post(async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(200).json(item);
      } catch (err) {
        res.status(400).send(`adding new ${modelName} failed - ${err}`);
      }
    });

  return { router, Model };
}

export default generateRoutes;
