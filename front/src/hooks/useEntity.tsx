import { useEffect, useState } from "react";
import { MutateConfig } from "react-query";
import { ContextProps } from "../context/generateContext";
import { BasicData } from "shared";
import { ItemModes } from "../utils/utils";
import { useComplexState } from "./useComplexState";
import { useDebouncedCallbackVoid } from "./useDebounce";

export type UseEntityProps<EntityData extends BasicData> =
  | {
      data: EntityData;
      initialMode: Exclude<ItemModes, ItemModes.New>;
    }
  | {
      data: Partial<EntityData>;
      initialMode: ItemModes.New;
    };

export const makeUseEntity = <
  EntityData extends BasicData,
  ContextFn extends () => ContextProps<EntityData>
>({
  contextFn,
  defaults,
}: {
  contextFn: ContextFn;
  defaults: EntityData;
}) => {
  const useEntity = ({ data, initialMode }: UseEntityProps<EntityData>) => {
    const {
      complexState: dataState,
      setComplexState: setDataState,
      reset,
    } = useComplexState<EntityData>({ ...defaults, ...data });

    const [mode, setMode] = useState(initialMode);

    const Context = contextFn();

    const create =
      mode === ItemModes.New
        ? (
            data: EntityData = dataState,
            config?: MutateConfig<EntityData, unknown, EntityData, unknown>
          ) => Context.create(data, config)
        : undefined;

    const update = (
      data: EntityData = dataState,
      config?: MutateConfig<EntityData, unknown, EntityData, unknown>
    ) => {
      Context.update(data, {
        onSuccess: () => Context.refresh(),
        ...(config ?? {}),
      });
    };

    const debouncedUpdateOnly = useDebouncedCallbackVoid(update, 750);

    const debouncedUpdate = (
      data: EntityData = dataState,
      config?: MutateConfig<EntityData, unknown, EntityData, unknown>
    ) => {
      setDataState(data);
      debouncedUpdateOnly(data, config);
    };

    const setOrUpdate = (
      data: EntityData,
      config?: MutateConfig<EntityData, unknown, EntityData, unknown>
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
        ? (config?: MutateConfig<void, unknown, EntityData, unknown>) =>
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
