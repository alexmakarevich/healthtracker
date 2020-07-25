import React, { createContext, useState, useEffect, ReactNode } from "react";
import { NutritionItem, NILogic } from "../logic/nutrition/NutritionLogic";
import { generateCRUD } from "./../api/apiGenerator";

const API = generateCRUD("http://localhost:4000/nutritionItems");

export const TestContext = createContext<any>("test context value");

interface NutritionContextProps {
  all: any[];
  create: Function;
  update: Function;
  delete: Function;
  getOneFromContext: Function;
  refresh: Function;
}

export const NutritionContext = createContext<NutritionContextProps>({
  all: [],
  update: () => {},
  create: () => {},
  delete: () => {},
  getOneFromContext: () => {},
  refresh: () => {},
});

interface Props {
  children: ReactNode;
}

function NIContext({ children }: Props) {
  const [all, setNutrition]: [NutritionItem[], Function] = useState([]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const allNutr: NutritionItem[] = await API.READ_ALL();
    setNutrition(allNutr);
    return all;
  }

  function getOneFromContext(id: NutritionItem["_id"]) {
    const item = all.find((item) => item._id === id);
    return item;
  }

  async function createOne(item: NutritionItem) {
    await API.CREATE(item).then(() => refresh());
  }

  async function updateOne(item: NutritionItem) {
    await API.UPDATE_BY_ID(item).then(() => refresh());
  }

  async function deleteOne(id: NutritionItem["_id"]) {
    await API.DELETE_BY_ID(id).then(() => refresh());
  }

  const providerValues = {
    all: all,
    update: updateOne,
    create: createOne,
    delete: deleteOne,
    getOneFromContext: getOneFromContext,
    refresh: refresh,
  };

  return (
    //TODO: figure out why context updates are inconsistent, especially when it comes to a refresh, following a change
    <NutritionContext.Provider value={providerValues}>
      {children}
    </NutritionContext.Provider>
  );
}

export default NIContext;
