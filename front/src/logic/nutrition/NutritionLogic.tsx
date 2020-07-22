import useCRUDwithIds from "../../useCRUDwithIds";
import { generateCRUD } from "../../api/apiGenerator";
import axios, { AxiosInstance } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

const dateTimeNow = new Date();

function generateTempId() {
  const randomNum = Math.random().toString();
  const tempId = randomNum;
  return tempId;
}

export class NutritionItem {
  _id: string = "default";
  id: number | string | undefined = generateTempId();
  title!: string;
  ingredientIds: NutritionItem["_id"][] = [];

  constructor(title: string, ingredientIds?: NutritionItem["ingredientIds"]) {
    this.title = title;
    ingredientIds !== undefined
      ? (this.ingredientIds = ingredientIds)
      : (this.ingredientIds = []);
  }

  addIngredient(ingredientId: NutritionItem["_id"]) {
    const newIngredients = [this.ingredientIds, ingredientId];
    const newNI = { ...this, ingredientIds: newIngredients };
    return newNI;
  }

  removeIngredient(ingredientId: NutritionItem["_id"]) {
    const newIngredients = this.ingredientIds.map((id) =>
      id === ingredientId ? null : id
    );
    const newNI = { ...this, ingredientIds: newIngredients };
    return newNI;
  }

  // returnSelf = ()
}

export const NutritionItemAPI = generateCRUD(
  "http://localhost:4000/nutritionItems"
);

export const NIaddIngredient = (
  ni: NutritionItem,
  ingredientId: NutritionItem["_id"]
) => {
  const newIngredients = [...ni.ingredientIds, ingredientId];
  const newNI = { ...ni, ingredientIds: newIngredients };
  return newNI;
};
