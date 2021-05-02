import { makeUseEntity } from "./../hooks/useEntity";
import { useNutritionItemContext } from "../context/NutritionItemContextProvider";
import { Basic, BASIC_DEFAULTS } from "./sharedLogic";

export interface NutritionItemDAO extends Basic {
  title: string;
  ingredientIds: NutritionItemDAO["_id"][];
}

export const nutritionItemDefaults: NutritionItemDAO = {
  ...BASIC_DEFAULTS,
  title: "",
  ingredientIds: [],
};

export const NILogic = {
  add_ingredient: (
    ni: NutritionItemDAO,
    ingredientId: NutritionItemDAO["_id"]
  ) => {
    const newIngredients = Array.from(
      new Set([...ni.ingredientIds, ingredientId])
    );
    const newNI = { ...ni, ingredientIds: newIngredients };
    return newNI;
  },
  remove_ingredient: (
    ni: NutritionItemDAO,
    ingredientId: NutritionItemDAO["_id"]
  ) => {
    const newIngredients = ni.ingredientIds.filter((id) => id !== ingredientId);
    const newNI = { ...ni, ingredientIds: newIngredients };
    return newNI;
  },
};

export const useNutrition = makeUseEntity({
  contextFn: useNutritionItemContext,
  defaults: nutritionItemDefaults,
});
