import React, { ReactNode, useCallback, useEffect } from "react";
import {
  MutateFunction,
  useQueryCache,
  useQuery,
  useMutation,
} from "react-query";
import { generateCRUD } from "../api/generateCRUD";
import { WithId } from "../common/types/types";
import { useAlertContext } from "../components/generic/actions/AlertContext";
import { AlertTypes } from "../components/generic/layout/Alert";
import { NutritionItemDAO } from "./../logic/nutritionItemLogic";
import { createContextDefined } from "./ContextWrapper";

// export const {
//   ContextProvider: NutritionItemProvider,
//   useContextDefined: useNutritionItemContext,
// } = generateContext<NutritionItemDAO>(
//   "http://localhost:4000/nutritionItems",
//   "Nutrition"
// );

const apiBaseUrl = "http://localhost:4000/nutritionItems";
const itemName = "Nutrition";

const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

export interface ContextProps<Something extends WithId> {
  all: Something[] | undefined;
  create: MutateFunction<Something, unknown, Something, unknown>;
  update: MutateFunction<Something, unknown, Something, unknown>;
  delete: MutateFunction<void, unknown, Something, unknown>;
  getOneFromContext: (idOfObjectToGet: string) => Something | undefined;
  refresh: () => void;
}

interface AddIngredientParams {
  ownId: string;
  ingredientId: string;
}

const [useContextDefined, Provider] =
  createContextDefined<
    ContextProps<NutritionItemDAO> & {
      addIngredient: MutateFunction<
        void,
        unknown,
        AddIngredientParams,
        unknown
      >;
      removeIngredient: MutateFunction<
        void,
        unknown,
        AddIngredientParams,
        unknown
      >;
    }
  >();

interface Props {
  children: ReactNode;
}

/** Quick and dirty context provider for nutrition. TODO: see if deriving it from generator makes sense */
function ContextProvider({ children }: Props) {
  const CRUD = generateCRUD<NutritionItemDAO>(apiBaseUrl);

  const queryClient = useQueryCache();

  const refresh = useCallback(async () => {
    // TODO: invalidate individual items
    await queryClient.invalidateQueries(itemName + "-get-all");
  }, [queryClient]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const { addAlert } = useAlertContext();

  const allQuery = useQuery(itemName + "-get-all", () => CRUD.READ_ALL(), {
    // onSuccess: () =>
    //   addAlert({
    //     children: `loaded all ${itemName}s`,
    //     type: AlertTypes.POSITIVE,
    //   }),
    onError: () =>
      addAlert({
        children: `ERROR: failed to load all ${itemName}s`,
        type: AlertTypes.NEGATIVE,
      }),
    staleTime: Infinity,
  });

  // const [all, setAll] = useState(allQuery.data?.data);
  const all = allQuery.data?.data;

  // TODO: check if should be replaced with geter from query, and/or merged with it somehow
  function getOneFromContext(id: string) {
    const item = all?.find((item) => item._id === id);
    return item;
  }

  // TODO: check if this needs to be returned
  const [createOne] = useMutation(
    (item: NutritionItemDAO) => CRUD.CREATE(item),
    {
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
              <p>details: {JSON.stringify(err)}</p>
            </>
          ),
          type: AlertTypes.NEGATIVE,
        }),
    }
  );

  const [updateOne] = useMutation(
    (item: NutritionItemDAO) => {
      const itemWithModifiedTimestamp = {
        ...item,
        lastModifiedOn: timestamp(),
      };
      return CRUD.UPDATE_BY_ID(itemWithModifiedTimestamp);
    },
    {
      onError: (error: any) => addAlert({ children: `${error.response}` }),
    }
  );

  const [deleteOne] = useMutation(
    (item: NutritionItemDAO) => {
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
      onError: (error: any) => {
        addAlert({
          children: (
            <>
              <p> Failed to delete ${itemName}</p> <p>`${error}` </p>
            </>
          ),
          type: AlertTypes.NEGATIVE,
        });
      },
    }
  );

  const ADD_INGREDIENT = async ({
    ownId,
    ingredientId,
  }: AddIngredientParams) => {
    try {
      await CRUD.axiosInstance.post<void>(
        `/addIngredient/${ownId}/${ingredientId}`
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error.response.data.result);
    }
  };

  const [addIngredient] = useMutation(
    (params: AddIngredientParams) => ADD_INGREDIENT(params),
    {
      onSuccess: () => {
        addAlert({
          children: `added ingredient`,
          type: AlertTypes.POSITIVE,
        });

        refresh();
      },
      onError: (e) =>
        addAlert({
          children: `ERROR: failed to add ingredient ${e}`,
          type: AlertTypes.NEGATIVE,
        }),
    }
  );

  const REMOVE_INGREDIENT = async ({
    ownId,
    ingredientId,
  }: AddIngredientParams) => {
    try {
      await CRUD.axiosInstance.post<void>(
        `/removeIngredient/${ownId}/${ingredientId}`
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error.response.data.result);
    }
  };

  const [removeIngredient] = useMutation(
    (params: AddIngredientParams) => REMOVE_INGREDIENT(params),
    {
      onSuccess: () => {
        addAlert({
          children: `removed ingredient`,
          type: AlertTypes.POSITIVE,
        });

        refresh();
      },
      onError: (e) =>
        addAlert({
          children: `ERROR: failed to remove ingredient ${e}`,
          type: AlertTypes.NEGATIVE,
        }),
    }
  );

  const providerValues: ContextProps<NutritionItemDAO> & {
    addIngredient: MutateFunction<void, unknown, AddIngredientParams, unknown>;
    removeIngredient: MutateFunction<
      void,
      unknown,
      AddIngredientParams,
      unknown
    >;
  } = {
    all: all,
    update: updateOne,
    create: createOne,
    delete: deleteOne,
    getOneFromContext: getOneFromContext,
    refresh: refresh,
    addIngredient,
    removeIngredient,
  };

  return <Provider value={providerValues}>{children}</Provider>;
}

export {
  ContextProvider as NutritionItemProvider,
  useContextDefined as useNutritionItemContext,
};
