function generateTempId() {
  const randomNum = Math.random().toString();
  const tempId = randomNum;
  return tempId;
}

export class NutritionItem {
  _id: string = "default";
  // TODO: make sure it's properly unique
  tempId: string = generateTempId();
  title!: string;
  ingredientIds: NutritionItem["_id"][] = [];

  constructor(title: string, ingredientIds?: NutritionItem["ingredientIds"]) {
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
