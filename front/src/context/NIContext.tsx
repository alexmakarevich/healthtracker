import React, { createContext, useState, useEffect, ReactNode } from "react";
import { NutritionItem, NILogic } from "../logic/nutrition/NutritionLogic";

export const TestContext = createContext<any>("test context value");

interface NutritionContextProps {
  all: NutritionItem[];
  create: Function;
  update: Function;
  delete: Function;
  getOneById: Function;
  getIdByTempId: Function;
  refresh: Function;
}

export const NutritionContext = createContext<NutritionContextProps>({
  all: [],
  update: () => {},
  create: () => {},
  delete: () => {},
  getOneById: () => {},
  getIdByTempId: () => {},
  refresh: () => {},
});

interface Props {
  children: ReactNode;
}

function NIContext({ children }: Props) {
  const [all, setNutrition]: [NutritionItem[], Function] = useState([]);

  useEffect(() => {
    console.log("App useEffect called");
    refresh().then(() => console.log("use effect complete: " + all));
  }, []);

  async function refresh() {
    const allNutr: NutritionItem[] = await NILogic.API.READ_ALL();
    setNutrition(allNutr);
    return all;
  }

  function getIdByTempId(tempId: NutritionItem["tempId"]) {
    refresh();
    const ni = all.find((item) => item.tempId === tempId);
    const id = ni?._id;
    return id;
  }
  function getOneById(id: NutritionItem["_id"]) {
    const item = all.find((item) => item._id === id);
    return item;
  }

  async function createOne(item: NutritionItem) {
    await NILogic.API.CREATE(item).then(() => refresh());
  }

  async function updateOne(item: NutritionItem) {
    console.log("updateOne called");
    console.log(item);
    await NILogic.API.UPDATE_BY_ID(item).then(() => refresh());
  }

  async function deleteOne(id: NutritionItem["_id"]) {
    await NILogic.API.DELETE_BY_ID(id).then(() => refresh());
  }

  const providerValues = {
    all: all,
    update: updateOne,
    create: createOne,
    delete: deleteOne,
    getIdByTempId: getIdByTempId,
    getOneById: getOneById,
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
