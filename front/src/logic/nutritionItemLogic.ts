import { Basic } from "./sharedLogic";

export class NutritionItem extends Basic {
  title!: string;
  ingredientIds: NutritionItem["_id"][] = [];

  constructor(title: string, ingredientIds?: NutritionItem["ingredientIds"]) {
    super();
    this.title = title;
    ingredientIds !== undefined
      ? (this.ingredientIds = ingredientIds)
      : (this.ingredientIds = []);
  }
}

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
