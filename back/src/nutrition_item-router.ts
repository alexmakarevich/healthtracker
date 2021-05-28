import { BaseSchema, Basic } from "./base_router";
import * as mongoose from "mongoose";
import generateRoutes, { RouteEnd } from "./routeGenerator";

export interface NutritionItemDAO extends Basic {
  title: string;
  ingredientIds: string[];
  ingredientIdsFlat: string[];
}

const Schema = mongoose.Schema;
const NutririonItem = new Schema<NutritionItemDAO>({
  ...BaseSchema.obj,
  title: {
    type: String,
  },
  ingredientIds: {
    type: Array,
  },
  ingredientIdsFlat: {
    type: Array<string>(),
  },
});

const { router, Model } = generateRoutes("NutritionItem", NutririonItem, {
  Get: true,
  GetAll: true,
  Update: true,
  Add: true,
  Delete: false,
});

router.route("/addIngredient/:ownId/:ingredientId/").post(async (req, res) => {
  const ownId = req.params.ownId;
  const ingredientId = req.params.ingredientId;

  const session = await Model.startSession();

  try {
    await session.withTransaction(async () => {
      if (ownId === ingredientId) {
        throw new Error(
          "An item of nutrition cannot be an ingredient of itself."
        );
      }
      const self = await Model.findById(ownId).session(session);
      const ingredient = await Model.findById(ingredientId).session(session);
      if (ingredient.ingredientIdsFlat.includes(ownId)) {
        throw new Error(
          "An item of nutrition cannot be an ingredient of its ingredient."
        );
      }
      const parents = await Model.find({ ingredientIdsFlat: ownId }).session(
        session
      );
      const newIngredientIds = [...self.ingredientIds, ingredientId];
      const newIngredientIdsFlat = [
        ...new Set([
          ...self.ingredientIdsFlat,
          ingredientId,
          ...ingredient.ingredientIdsFlat,
        ]),
      ];

      await self.updateOne({
        ingredientIds: newIngredientIds,
        ingredientIdsFlat: newIngredientIdsFlat,
      });

      for (const parent of parents) {
        const newIngredientsFlatForParent = [
          ...new Set([...newIngredientIdsFlat, ...parent.ingredientIdsFlat]),
        ];
        await parent.updateOne({
          ingredientIdsFlat: newIngredientsFlatForParent,
        });
      }

      res.status(200).json({
        result: "Ingredient added successfully",
      });
    });
  } catch (error) {
    res
      .status(400)
      .json({ result: "Cannot add ingredient due to error: " + error, error });
  }

  session.endSession();
});

router
  .route("/removeIngredient/:ownId/:ingredientId/")
  .post(async (req, res) => {
    const ownId = req.params.ownId;
    const ingredientId = req.params.ingredientId;

    const session = await Model.startSession();

    try {
      await session.withTransaction(async () => {
        const self = await Model.findById(ownId).session(session);
        type NutritionObject = typeof self;

        if (!self.ingredientIdsFlat.includes(ingredientId)) {
          throw new Error(
            "Cannot remove nutrition from ingredient list - it is not an ingredient of this nutrition item"
          );
        }

        const parents = await Model.find({ ingredientIdsFlat: ownId }).session(
          session
        );

        const newIngredientIds = self.ingredientIds.filter(
          (i) => i !== ingredientId
        );

        const newIngredientIdsFlat =
          await getIngredientsFlatBasedOnRemainingChildren(newIngredientIds);

        await self.updateOne({
          ingredientIds: newIngredientIds,
          ingredientIdsFlat: newIngredientIdsFlat,
        });

        for (const parent of parents) {
          const flatIngredientsFromOtherChildren =
            await getIngredientsFlatBasedOnRemainingChildren(
              parent.ingredientIds.filter((id) => id !== ownId) // removing ownId, cause its sub-ingredients are the ones that need updating
            );

          await parent.updateOne({
            ingredientIdsFlat: [
              ...flatIngredientsFromOtherChildren,
              ...newIngredientIdsFlat,
              ownId,
            ],
          });
        }

        res.status(200).json({
          result: "Ingredient removed successfully",
        });

        async function getIngredientsFlatBasedOnRemainingChildren(
          idList: string[]
        ) {
          const newIngredients: NutritionObject[] = [];
          for (const id of idList) {
            const i = await Model.findById(id);
            newIngredients.push(i);
          }
          const newIngredientIdsFlat = newIngredients.flatMap(
            (i) => i.ingredientIdsFlat
          );
          return [...newIngredientIdsFlat, ...idList];
        }
      });
    } catch (error) {
      res.status(400).json({
        result: "Cannot remove ingredient." + error,
        error: error,
      });
    }

    session.endSession();
  });

router.route(RouteEnd.Delete).delete(async (req, res) => {
  const id = req.params.id;
  const session = await Model.startSession();
  try {
    await session.withTransaction(async () => {
      const parents = await Model.find({ ingredientIdsFlat: id }).session(
        session
      );
      if (parents.length > 0) {
        res
          .status(400)
          .send(
            "Cannot delete nutrition - it's an ingredient of other nutirition items"
          );
      } else {
        await Model.findByIdAndDelete(id);
        res.status(200).json(`item ${req.params.id} deleted!`);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export const Nutrition = { router, Model };
