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

  // addIngredient(ingredientId: NutritionItem["_id"]) {
  //   const newIngredients = [this.ingredientIds, ingredientId];
  //   const newNI = { ...this, ingredientIds: newIngredients };
  //   return newNI;
  // }

  // removeIngredient(ingredientId: NutritionItem["_id"]) {
  //   const newIngredients = this.ingredientIds.map((id) =>
  //     id === ingredientId ? null : id
  //   );
  //   const newNI = { ...this, ingredientIds: newIngredients };
  //   return newNI;
  // }
}

export const NILogic = {
  API: generateCRUD("http://localhost:4000/nutritionItems"),
  LocalOperations: {
    add_ingredient: (ni: NutritionItem, ingredientId: NutritionItem["_id"]) => {
      console.log(
        "local add_ingredient called: " + ni.title + ", " + ingredientId
      );
      const newIngredients = Array.from(
        new Set([...ni.ingredientIds, ingredientId])
      );
      console.log("new Ingredients: ");
      console.log(newIngredients);
      const newNI = { ...ni, ingredientIds: newIngredients };
      console.log("newNI: ");
      console.log(newNI);
      return newNI;
    },
    remove_ingredient: (
      ni: NutritionItem,
      ingredientId: NutritionItem["_id"]
    ) => {
      console.log(
        "local remove_ingredient called: " + ni.title + ", " + ingredientId
      );
      const newIngredients = ni.ingredientIds.filter(
        (id) => id !== ingredientId
      );
      const newNI = { ...ni, ingredientIds: newIngredients };
      return newNI;
    },
  },
};
