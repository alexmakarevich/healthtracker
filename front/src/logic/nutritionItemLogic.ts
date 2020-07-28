import { Basic } from "./sharedLogic";

export interface NutritionItem extends Basic {
  title: string;
  ingredientIds: NutritionItem["_id"][];
}

export const nutritionItemDefaults: NutritionItem = {
  _id: "not yet saved",
  createdOn: new Date().toISOString(),
  lastModifiedOn: new Date().toISOString(),
  _v: -1,
  title: "",
  ingredientIds: [],
};

export const NILogic = {
  add_ingredient: (ni: NutritionItem, ingredientId: NutritionItem["_id"]) => {
    const newIngredients = Array.from(
      new Set([...ni.ingredientIds, ingredientId])
    );
    const newNI = { ...ni, ingredientIds: newIngredients };
    return newNI;
  },
  remove_ingredient: (
    ni: NutritionItem,
    ingredientId: NutritionItem["_id"]
  ) => {
    const newIngredients = ni.ingredientIds.filter((id) => id !== ingredientId);
    const newNI = { ...ni, ingredientIds: newIngredients };
    return newNI;
  },
};
