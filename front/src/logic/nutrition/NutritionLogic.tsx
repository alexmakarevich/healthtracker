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
  _id: number | string = 0;
  id: number | string | undefined = generateTempId();
  title!: string;
  ingredientIds: number[] | string[] = [];

  constructor(title: string, ingredientIds?: number[] | string[]) {
    this.title = title;
    ingredientIds !== undefined
      ? (this.ingredientIds = ingredientIds)
      : (this.ingredientIds = []);
  }
}

// api for NI
export const {
  create: NIcreate,
  readById: NIgetById,
  readAll: NIgetAll,
  updateById: NIupdateById,
  deleteById: NIdeleteById,
} = generateCRUD("http://localhost:4000/nutritionItems");
