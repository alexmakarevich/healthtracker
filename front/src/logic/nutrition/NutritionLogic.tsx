import useCRUDwithIds from "../../useCRUDwithIds";
import { generateAPI } from "../../api/apiGenerator";

const dateTimeNow = new Date();

function generateTempId() {
  const randomNum = Math.random().toString();
  const tempId = randomNum;
  return tempId;
}

export class NutritionItem {
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

// interface NutritionItemDAO {
//   id: number | string;
//   title: string;
//   ingredient_ids: number[] | string[];
// }

// function frontToBack (front: NutritionItem): NutritionItemDAO {
//   const back = {id: front.id,
//   title: front.title,
//   ingredient_ids: front.ingredientIds
//   }
// }

// api for NI
export const { create: NIcreate, getById: NIgetById } = generateAPI(
  "http://localhost:4000/nutritionItems"
);

// TODO: replace useState data with data from backend, then remove the code below

function startingNutrition() {
  const nutrArray: NutritionItem[] = [];
  nutrArray.push(new NutritionItem("apple"));
  nutrArray.push(new NutritionItem("orange"));
  nutrArray.push(new NutritionItem("tomato"));
  nutrArray.push(new NutritionItem("pizza", [5, 6, 7]));
  nutrArray.push(new NutritionItem("dough"));
  nutrArray.push(new NutritionItem("cheese"));
  nutrArray.push(new NutritionItem("salami"));
  return nutrArray;
}

export function useNutritionCRUD(
  initialNutrition: NutritionItem[] = startingNutrition()
) {
  const { items, C, R, U, D } = useCRUDwithIds("id", initialNutrition);

  return {
    nutrition: items,
    createNutrition: (nutritionItem: NutritionItem) => {
      C(nutritionItem);
    },
    readNutrition: (id: string | number) => {
      return R(id);
    },
    updateNutrition: (nutritionItem: NutritionItem) => {
      U(nutritionItem);
    },
    deleteNutrition: (nutritionItem: NutritionItem) => {
      D(nutritionItem);
    },
  };
}
