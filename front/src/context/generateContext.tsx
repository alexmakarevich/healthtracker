import React, { useEffect, ReactNode, useState } from "react";
import {
  MutateFunction,
  useMutation,
  useQuery,
  useQueryCache,
} from "react-query";
import { generateCRUD } from "../api/generateCRUD";
import { WithId } from "../common/types/types";
import { useAlertContext } from "../components/generic/actions/AlertContext";
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

/**
 * TODO: fix inconsistencies on slow updates - block re-request of update, while data is loading or until previous update operation is done
 */

export function generateContext<Item extends WithId>(
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
    const CRUD = generateCRUD<Item>(apiBaseUrl);

    useEffect(() => {
      refresh();
    }, []);

    const { addAlert } = useAlertContext();

    const queryClient = useQueryCache();

    const allQuery = useQuery(itemName + "-get-all", () => CRUD.READ_ALL(), {});

    // const [all, setAll] = useState(allQuery.data?.data);
    const all = allQuery.data?.data;

    // TODO: fix no refresh on first mutation

    // TODO: check if better to just return the getter, and/or not return at all
    async function refresh() {
      //TODO: roll this back to just refresh
      // const newItems = await CRUD.READ_ALL();
      // setAll(newItems?.data);
      // console.log("refresh", { newItems });
      await queryClient.invalidateQueries(itemName + "-get-all");
      // addAlert("refresh " + itemName);
    }

    // TODO: check if should be replaced with geter from query, and/or merged with it somehow
    function getOneFromContext(id: string) {
      const item = all?.find((item) => item._id === id);
      return item;
    }

    // TODO: check if this needs to be returned
    const [
      createOne,
      { status, data, error, isSuccess, isLoading },
    ] = useMutation((item: Item) => CRUD.CREATE(item), {
      onSuccess: async (data) => {
        await refresh();
        addAlert({ content: `created new ${itemName}` });

        console.log(data);
      },
    });

    const [updateOne, {}] = useMutation(
      (item: Item) => {
        const itemWithModifiedTimestamp = {
          ...item,
          lastModifiedOn: timestamp(),
        };
        return CRUD.UPDATE_BY_ID(itemWithModifiedTimestamp);
      },
      {
        onSuccess: (_data, vars) => addAlert({ content: JSON.stringify(vars) }),
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
