import { makeUseEntity, UseEntityProps } from "./../hooks/useEntity";
import { useNutritionItemContext } from "../context/NutritionItemContextProvider";
import { Basic, BASIC_DEFAULTS } from "./sharedLogic";
import { ItemModes } from "../utils/utils";

export interface NutritionItemDAO extends Basic {
  title: string;
  ingredientIds: NutritionItemDAO["_id"][];
  ingredientIdsFlat: NutritionItemDAO["_id"][];
}

export const nutritionItemDefaults: NutritionItemDAO = {
  ...BASIC_DEFAULTS,
  title: "",
  ingredientIds: [],
  ingredientIdsFlat: [],
};

export const useNutrition = (props: UseEntityProps<NutritionItemDAO>) => {
  const base = makeUseEntity({
    contextFn: useNutritionItemContext,
    defaults: nutritionItemDefaults,
  })(props);

  const ctx = base.contextFn();

  const addIngredient = (ingredientId: string) => {
    if (base.mode === ItemModes.New) {
      const addedIngredient = ctx.getOneFromContext(ingredientId);
      const ingredientIds = Array.from(
        new Set([...base.data.ingredientIds, ingredientId])
      );
      const ingredientIdsFlat = Array.from(
        new Set([
          ...base.data.ingredientIdsFlat,
          ingredientId,
          ...(addedIngredient?.ingredientIdsFlat ?? []),
        ])
      );
      return base.setData({ ...base.data, ingredientIds, ingredientIdsFlat });
    } else {
      ctx.addIngredient({ ownId: base.data._id, ingredientId });
    }
  };

  const removeIngredient = (ingredientId: string) => {
    if (base.mode === ItemModes.New) {
      const ingredientIds = base.data.ingredientIds.filter(
        (id) => id !== ingredientId
      );
      const ingredientIdsFlat = ingredientIds.reduce<string[]>(
        (acc, currId) => {
          const currIngredient = ctx.getOneFromContext(currId);
          return [...(currIngredient?.ingredientIdsFlat ?? []), ...acc];
        },
        []
      );
      return base.setData({ ...base.data, ingredientIds, ingredientIdsFlat });
    } else {
      ctx.removeIngredient({ ownId: base.data._id, ingredientId });
    }
  };

  return { ...base, addIngredient, removeIngredient };
};
