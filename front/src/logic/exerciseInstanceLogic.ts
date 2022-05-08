import { ItemModes } from "./../utils/utils";
import { useEffect, useState } from "react";

import { ExerciseInstanceContext } from "../context/ExerciseInstanceContextProvider";
import { ExerciseTypeContext } from "../context/ExerciseTypeContextProvider";
import { ExceptAutoSetBasics, ExerciseInstanceData } from "shared";
import { MutateConfig } from "react-query";
import { EventContext } from "../context/EventContextProvider";
import { useComplexState } from "../hooks/useComplexState";
import { useDebouncedCallbackVoid } from "../hooks/useDebounce";

type ExerciseInstanceDataNew = ExceptAutoSetBasics<ExerciseInstanceData>;

type New = {
  data: ExerciseInstanceDataNew;
  initialMode: ItemModes.New;
};

type Old = {
  data: ExerciseInstanceData;
  initialMode: Exclude<ItemModes, ItemModes.New>;
};

type UseExerciseInstanceProps = New | Old;

export const useExerciseInstance = ({
  data,
  initialMode,
}: UseExerciseInstanceProps) => {
  const defaults: Partial<ExerciseInstanceData> = {
    _id: "new",
    lastModifiedOn: new Date().toUTCString(),
    createdOn: new Date().toUTCString(),
  };

  const getDataWithDefaults = (
    data: ExerciseInstanceDataNew | ExerciseInstanceData
  ) => ({ ...defaults, ...data } as ExerciseInstanceData);

  const {
    complexState: dataState,
    setComplexState: setDataState,
    reset,
  } = useComplexState<Old["data"]>(getDataWithDefaults(data));
  const [mode, setMode] = useState(initialMode);
  const EIContext = ExerciseInstanceContext.use();
  const ExContext = ExerciseTypeContext.use();
  const EvContext = EventContext.use();

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintain state, even if global context changes. This allows to create and refeence sub-items in new item */

    if (mode !== ItemModes.New) {
      reset();
    }
  }, [data, mode]); // reset not included as it constantly updates
  // TODO: fix weird reset behavior above

  const create =
    mode === ItemModes.New
      ? (
          data: ExerciseInstanceData = dataState,
          config?: MutateConfig<
            ExerciseInstanceData,
            unknown,
            ExerciseInstanceData,
            unknown
          >
        ) => EIContext.create(data, config)
      : undefined;

  const update = (
    data: ExerciseInstanceData = dataState,
    config?: MutateConfig<
      ExerciseInstanceData,
      unknown,
      ExerciseInstanceData,
      unknown
    >
  ) => {
    EIContext.update(data, {
      onSuccess: () => EIContext.refresh(),
      ...(config ?? {}),
    });
  };

  const debouncedUpdateOnly = useDebouncedCallbackVoid(update, 750);

  const debouncedUpdate = (
    data: ExerciseInstanceData = dataState,
    config?: MutateConfig<
      ExerciseInstanceData,
      unknown,
      ExerciseInstanceData,
      unknown
    >
  ) => {
    setDataState(data);
    debouncedUpdateOnly(data, config);
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

  const setOrUpdate = (
    data: ExerciseInstanceData,
    config?: MutateConfig<
      ExerciseInstanceData,
      unknown,
      ExerciseInstanceData,
      unknown
    >
  ) => {
    if (mode === ItemModes.Edit || mode === ItemModes.New) {
      return setDataState(data);
    } else {
      return update(data, config);
    }
  };

  const deleteFn =
    mode !== ItemModes.New
      ? (config?: MutateConfig<void, unknown, ExerciseInstanceData, unknown>) =>
          EIContext.delete(dataState, config)
      : undefined;

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
    delete: deleteFn,
    exerciseData: ExContext.getOneFromContext(dataState.exerciseId),
    eventData: EvContext.getOneFromContext(dataState.eventId),
  };
};

export type ExerciseInstance = ReturnType<typeof useExerciseInstance>;
