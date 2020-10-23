import React, { createContext, useState, useEffect, ReactNode } from "react";
import { generateCRUD } from "../api/apiGenerator";

const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

interface GeneratorProps {
  apiBaseUrl: string;
}

export interface ContextProps<Item> {
  all: Item[];
  // likely return type: Promise<itemType>
  create: (objectToCreate: Item) => any;
  update: (objectToUpdate: Item) => any;
  delete: (objectToDelete: Item) => any;
  getOneFromContext: (idOfObjectToGet: string) => any;
  refresh: () => void;
}

/**
 * creates a context and its provider with standard CRUD for a collection of items
 * make sure to provide item types
 * make sure to give the context & provider a unique name
 */
function contextGeneratorFn<itemType>({ apiBaseUrl }: GeneratorProps) {
  type ItemWithId = itemType & {
    _id: string;
  };

  const initialContextValue = {
    all: [],
    update: () => {},
    create: () => {},
    delete: () => {},
    getOneFromContext: () => {},
    refresh: () => {},
  };

  const Context = createContext<ContextProps<ItemWithId>>(initialContextValue);

  interface Props {
    children: ReactNode;
  }

  function ContextProvider({ children }: Props) {
    const [all, setAll]: [ItemWithId[], Function] = useState([]);

    const API = generateCRUD(apiBaseUrl);

    useEffect(() => {
      refresh();
    }, []);

    async function refresh() {
      const all: ItemWithId[] = await API.READ_ALL();
      setAll(all);
    }

    function getOneFromContext(id: string) {
      const item = all.find((item) => item._id === id);
      return item;
    }

    async function createOne(item: ItemWithId) {
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

    async function updateOne(item: ItemWithId) {
      const itemWithModifiedTimestamp = {
        ...item,
        lastModifiedOn: timestamp(),
      };
      await API.UPDATE_BY_ID(itemWithModifiedTimestamp).then(() => refresh());
    }

    async function deleteOne(item: ItemWithId) {
      await API.DELETE_BY_ID(item._id).then(() => refresh());
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
