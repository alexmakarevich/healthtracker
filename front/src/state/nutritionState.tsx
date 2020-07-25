import { NutritionItem, NILogic } from "../logic/nutrition/NutritionLogic";
import { getAllByAltText } from "@testing-library/react";

// trying to build totally custom state mgmt. will likely delete

let all: NutritionItem[] = [];

const refresh = async () => {
  all = await NILogic.API.READ_ALL();
};

let count = 0;
function countUp() {
  count = count + 1;
}

export const NIstate = {
  getAll: () => all,
  refresh: refresh,
};
