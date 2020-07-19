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
}

export const NIaddIngredient = (
  ni: NutritionItem,
  ingredientId: NutritionItem["_id"]
) => {
  const newIngredients = [...ni.ingredientIds, ingredientId];
  const newNI = { ...ni, ingredientIds: newIngredients };
  return newNI;
};

export const NIaddIngredientAndUpdate = (
  ni: NutritionItem,
  ingredientId: NutritionItem["_id"]
) => {
  const newNI = NIaddIngredient(ni, ingredientId);
  NIupdateById(newNI);
};

// TODO see if below is at all useful anymore, likely remove
// local state-based api for NI
export const {
  create: NIcreate,
  readById: NIreadById,
  readAll: NIreadAll,
  updateById: NIupdateById,
  deleteById: NIdeleteById,
} = generateCRUD("http://localhost:4000/nutritionItems");
