import React, { useState, useEffect, ReactNode } from "react";
import { generateCRUD, WithId } from "../api/apiGenerator";
import { createContextDefined } from "./ContextWrapper";

const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

export interface ContextProps<Something extends WithId> {
  all: Something[];
  // likely return type: Promise<itemType>
  create: (objectToCreate: Something) => Promise<Something | undefined>;
  update: (objectToUpdate: Something) => void;
  delete: (objectToDelete: Something) => void;
  getOneFromContext: (idOfObjectToGet: string) => Something | undefined;
  refresh: () => void;
}

/**
 * creates a context and its provider with standard CRUD for a collection of items
 * make sure to provide item types
 * make sure to give the context & provider a unique name
 */
export function generateDefinedContext<Item extends WithId>(
  apiBaseUrl: string
) {
  const [useContextDefined, Provider] = createContextDefined<
    ContextProps<Item>
  >();

  interface Props {
    children: ReactNode;
  }

  function ContextProvider({ children }: Props) {
    const [all, setAll]: [Item[], Function] = useState([]);

    const API = generateCRUD<Item>(apiBaseUrl);

    useEffect(() => {
      refresh();
    }, []);

    async function refresh() {
      const all = await API.READ_ALL();
      setAll(all);
    }

    function getOneFromContext(id: string) {
      const item = all.find((item) => item._id === id);
      return item;
    }

    async function createOne(item: Item) {
      const result = await API.CREATE(item);
      refresh();
      // console.log("res");
      // console.log(res);

      // console.log("result");
      // console.log(result);
      return result;
    }

    async function updateOne(item: Item) {
      const itemWithModifiedTimestamp = {
        ...item,
        lastModifiedOn: timestamp(),
      };
      await API.UPDATE_BY_ID(itemWithModifiedTimestamp).then(() => refresh());
    }

    async function deleteOne(item: Item) {
      await API.DELETE_BY_ID(item._id).then(() => refresh());
    }

    const providerValues: ContextProps<Item> = {
      all: all,
      update: updateOne,
      create: createOne,
      delete: deleteOne,
      getOneFromContext: getOneFromContext,
      refresh: refresh,
    };

    return (
      //TODO: figure out why context updates are inconsistent, especially when it comes to a refresh, following a change
      <Provider value={providerValues}>{children}</Provider>
    );
  }

  // unsure if to return declaration or result
  return {
    ContextProvider,
    useContextDefined,
  };
}
