import React, { createContext, useState, useEffect, ReactNode } from "react";
import { generateCRUD } from "../api/apiGenerator";

const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

interface GeneratorProps {
  apiBaseUrl: string;
}

/**
 * creates a context and its provider with standard CRUD for a collection of items
 * make sure to provide item types
 * make sure to give the context & provider a unique name
 */
function contextGeneratorFn<itemType>({ apiBaseUrl }: GeneratorProps) {
  interface ContextProps {
    all: itemType[];
    // likely return type: Promise<itemType>
    create: (objectToCreate: itemType) => any;
    update: (objectToUpdate: itemType) => any;
    delete: (idToDelete: string) => any;
    getOneFromContext: (idOfObjectToGet: string) => any;
    refresh: () => void;
  }

  const initialContextValue = {
    all: [],
    update: () => {},
    create: () => {},
    delete: () => {},
    getOneFromContext: () => {},
    refresh: () => {},
  };

  const Context = createContext<ContextProps>(initialContextValue);

  interface Props {
    children: ReactNode;
  }

  function ContextProvider({ children }: Props) {
    const [all, setNutrition]: [any[], Function] = useState([]);

    const API = generateCRUD(apiBaseUrl);

    useEffect(() => {
      refresh();
    }, []);

    async function refresh() {
      const allNutr: any[] = await API.READ_ALL();
      setNutrition(allNutr);
    }

    function getOneFromContext(id: any["_id"]) {
      const item = all.find((item) => item._id === id);
      return item;
    }

    async function createOne(item: any) {
      let result;
      await API.CREATE(item).then((res) => {
        refresh();
        // console.log("res");
        // console.log(res);
        result = res;
      });
      // console.log("result");
      // console.log(result);
      return result;
    }

    async function updateOne(item: any) {
      const itemWithModifiedTimestamp = {
        ...item,
        lastModifiedOn: timestamp(),
      };
      await API.UPDATE_BY_ID(itemWithModifiedTimestamp).then(() => refresh());
    }

    async function deleteOne(id: string) {
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
      <Context.Provider value={providerValues}>{children}</Context.Provider>
    );
  }

  const toReturn = {
    contextProvider: ContextProvider,
    context: Context,
  };

  // unsure if to return declaration or result
  return toReturn;
}

export default contextGeneratorFn;
