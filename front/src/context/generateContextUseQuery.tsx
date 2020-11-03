import React, { useState, useEffect, ReactNode } from "react";
import {
  MutateFunction,
  MutationFunction,
  useMutation,
  useQuery,
} from "react-query";
import { generateCRUD, WithId } from "../api/apiGenerator";
import { generateCRUDForHook } from "../api/apiGeneratorForHook";
import { createContextDefined } from "./ContextWrapper";

const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

export interface ContextProps<Something extends WithId> {
  all: Something[] | undefined;
  create: MutateFunction<Something, unknown, Something, unknown>;
  update: MutateFunction<void, unknown, Something, unknown>;
  delete: MutateFunction<undefined, unknown, Something, unknown>;
  getOneFromContext: (idOfObjectToGet: string) => Something | undefined;
  refresh: () => void;
}

/**
 * creates a context and its provider with standard CRUD for a collection of items
 * make sure to provide item types
 * make sure to give the context & provider a unique name
 */
export function generateContextUseQuery<Item extends WithId>(
  apiBaseUrl: string,
  itemName: string
) {
  const [useContextDefined, Provider] = createContextDefined<
    ContextProps<Item>
  >();

  interface Props {
    children: ReactNode;
  }

  function ContextProvider({ children }: Props) {
    const CRUD = generateCRUDForHook<Item>(apiBaseUrl);

    useEffect(() => {
      refresh();
    }, []);

    const allQuery = useQuery(
      itemName + " -get all",
      () => CRUD.READ_ALL(),
      {}
    );

    const all = allQuery.data?.data;

    // TODO: check if better to just return the getter, and/or not return at all
    async function refresh() {
      allQuery.refetch();
    }

    // TODO: check if should be replaced with geter from query, and/or merged with it somehow
    function getOneFromContext(id: string) {
      const item = all?.find((item) => item._id === id);
      return item;
    }

    const [createOne, { data: createData }] = useMutation(
      (item: Item) => CRUD.CREATE(item),
      {
        onSuccess: (data) => {
          refresh();
          console.log(data);
        },
      }
    );

    const [updateOne] = useMutation(
      (item: Item) => {
        const itemWithModifiedTimestamp = {
          ...item,
          lastModifiedOn: timestamp(),
        };
        return CRUD.UPDATE_BY_ID(itemWithModifiedTimestamp);
      },
      {
        onSuccess: () => refresh(),
      }
    );

    const [deleteOne] = useMutation(
      (item: Item) => {
        return CRUD.DELETE_BY_ID(item._id);
      },
      {
        onSuccess: () => refresh(),
      }
    );

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
