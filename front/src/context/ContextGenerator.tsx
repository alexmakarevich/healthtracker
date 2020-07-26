import React, { createContext, useState, useEffect, ReactNode } from "react";
import { generateCRUD } from "../api/apiGenerator";

export interface ContextProps {
  all: any[];
  create: Function;
  update: Function;
  delete: Function;
  getOneFromContext: Function;
  refresh: Function;
}

export const initialContextValue = {
  all: [],
  update: () => {},
  create: () => {},
  delete: () => {},
  getOneFromContext: () => {},
  refresh: () => {},
};

interface Props {
  apiBaseUrl: string;
  children: ReactNode;
  context: React.Context<ContextProps>;
}

function NIContext({ apiBaseUrl, children, context }: Props) {
  const [all, setNutrition]: [any[], Function] = useState([]);

  const API = generateCRUD(apiBaseUrl);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const allNutr: any[] = await API.READ_ALL();
    setNutrition(allNutr);
    return all;
  }

  function getOneFromContext(id: any["_id"]) {
    const item = all.find((item) => item._id === id);
    return item;
  }

  async function createOne(item: any) {
    let result;
    await API.CREATE(item).then((res) => {
      refresh();
      console.log("res");
      console.log(res);
      result = res;
    });
    console.log("result");
    console.log(result);
    return result;
  }

  async function updateOne(item: any) {
    await API.UPDATE_BY_ID(item).then(() => refresh());
  }

  async function deleteOne(id: any["_id"]) {
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
    <context.Provider value={providerValues}>{children}</context.Provider>
  );
}

export default NIContext;
