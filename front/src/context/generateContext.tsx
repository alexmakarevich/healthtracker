import { AxiosResponse } from "axios";
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
import { AlertTypes } from "../components/generic/layout/Alert";
import { createContextDefined } from "./ContextWrapper";

const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

export interface ContextProps<Something extends WithId> {
  all: Something[] | undefined;
  create: MutateFunction<Something, unknown, Something, unknown>;
  update: MutateFunction<Something, unknown, Something, unknown>;
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

    // TODO: check how tominimize number of updates
    const allQuery = useQuery(itemName + "-get-all", () => CRUD.READ_ALL(), {
      onSuccess: () =>
        addAlert({
          children: `loaded all ${itemName}s`,
          type: AlertTypes.POSITIVE,
        }),
      onError: () =>
        addAlert({
          children: `ERROR: failed to load all ${itemName}s`,
          type: AlertTypes.NEGATIVE,
        }),
      staleTime: Infinity,
    });

    // const [all, setAll] = useState(allQuery.data?.data);
    const all = allQuery.data?.data;

    // TODO: check if better to just return the getter, and/or not return at all
    async function refresh() {
      await queryClient.invalidateQueries(itemName + "-get-all");
    }

    // TODO: check if should be replaced with geter from query, and/or merged with it somehow
    function getOneFromContext(id: string) {
      const item = all?.find((item) => item._id === id);
      return item;
    }

    // TODO: check if this needs to be returned
    const [createOne] = useMutation((item: Item) => CRUD.CREATE(item), {
      onSuccess: async (data) => {
        await refresh();
        addAlert({
          children: `created new ${itemName}`,
          type: AlertTypes.POSITIVE,
        });

        console.log(data);
      },
      onError: (err) =>
        addAlert({
          children: (
            <>
              <p>ERROR: could not create {itemName}</p>
              <p>details: {err}</p>
            </>
          ),
          type: AlertTypes.NEGATIVE,
        }),
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
        // onSuccess: (_data, vars) =>
        //   addAlert({ children: JSON.stringify(vars) }),
        onError: () =>
          addAlert({ children: `ERROR: failed to update ${itemName}` }),
      }
    );

    const [deleteOne] = useMutation(
      (item: Item) => {
        return CRUD.DELETE_BY_ID(item._id);
      },
      {
        onSuccess: () => {
          addAlert({
            children: `deleted ${itemName}`,
            type: AlertTypes.POSITIVE,
          });

          refresh();
        },
        onError: () =>
          addAlert({ children: `ERROR: failed to delete ${itemName}` }),
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

    return <Provider value={providerValues}>{children}</Provider>;
  }

  // unsure if to return declaration or result
  return {
    ContextProvider,
    useContextDefined,
  };
}
