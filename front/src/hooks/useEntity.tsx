import { useEffect, useState } from "react";
import { MutateConfig } from "react-query";
import { ContextProps } from "../context/generateContext";
import { Basic } from "../logic/sharedLogic";
import { ItemModes } from "../utils/utils";
import { useComplexState } from "./useComplexState";
import { useDebouncedCallbackVoid } from "./useDebounce";

export type UseEntityProps<EntityDAO extends Basic> =
  | {
      data: EntityDAO;
      initialMode: Exclude<ItemModes, ItemModes.New>;
    }
  | {
      data: Partial<EntityDAO>;
      initialMode: ItemModes.New;
    };

/** replacing useEntityBase. TODO: remove the latter, once transitioned completely */
export const makeUseEntity = <
  EntityDAO extends Basic,
  ContextFn extends () => ContextProps<EntityDAO>
>({
  contextFn,
  defaults,
}: {
  contextFn: ContextFn;
  defaults: EntityDAO;
}) => {
  const useEntity = ({ data, initialMode }: UseEntityProps<EntityDAO>) => {
    const {
      complexState: dataState,
      setComplexState: setDataState,
      reset,
    } = useComplexState<EntityDAO>({ ...defaults, ...data });

    const [mode, setMode] = useState(initialMode);

    const Context = contextFn();

    const create =
      mode === ItemModes.New
        ? (
            data: EntityDAO = dataState,
            config?: MutateConfig<EntityDAO, unknown, EntityDAO, unknown>
          ) => Context.create(data, config)
        : undefined;

    const update = (
      data: EntityDAO = dataState,
      config?: MutateConfig<EntityDAO, unknown, EntityDAO, unknown>
    ) => {
      Context.update(data, {
        onSuccess: () => Context.refresh(),
        ...(config ?? {}),
      });
    };

    const debouncedUpdateOnly = useDebouncedCallbackVoid(update, 750);

    const debouncedUpdate = (
      data: EntityDAO = dataState,
      config?: MutateConfig<EntityDAO, unknown, EntityDAO, unknown>
    ) => {
      setDataState(data);
      debouncedUpdateOnly(data, config);
    };

    const setOrUpdate = (
      data: EntityDAO,
      config?: MutateConfig<EntityDAO, unknown, EntityDAO, unknown>
    ) => {
      if (mode === ItemModes.Edit || mode === ItemModes.New) {
        return setDataState(data);
      } else {
        return update(data, config);
      }
    };

    const setOrUpdateDebounced = (...props: Parameters<typeof setOrUpdate>) => {
      const data = props[0] ?? dataState;
      const config = props[1];
      if (mode === ItemModes.Edit || mode === ItemModes.New) {
        return setDataState(data);
      } else {
        return debouncedUpdate(data, config);
      }
    };

    const remove =
      mode !== ItemModes.New
        ? (config?: MutateConfig<void, unknown, EntityDAO, unknown>) =>
            Context.delete(dataState, config)
        : undefined;

    // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
    useEffect(() => {
      /* maintain state, even if global context changes. This allows to create and refeence sub-items in new item */

      if (mode !== ItemModes.New) {
        reset();
      }
    }, [data, mode]); // reset not included as it constantly updates
    // TODO: fix weird reset behavior above. useCallback didn't help initially.

    return {
      data: dataState,
      setData: setDataState,
      reset,
      mode,
      setMode,
      create,
      setOrUpdate,
      setOrUpdateDebounced,
      update,
      remove,
      contextFn,
    };
  };

  return useEntity;
};
