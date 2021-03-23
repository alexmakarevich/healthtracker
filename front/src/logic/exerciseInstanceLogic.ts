import { AxiosResponse } from "axios";
import { ItemModes } from "./../utils/utils";
import { updateObject } from "./../common/updateObject";
import { useEffect, useMemo, useState } from "react";

import { useExerciseInstanceContext } from "../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../context/ExerciseTypeContextProvider";
import { Basic, BASIC_DEFAULTS, ExceptAutoSetBasics } from "./sharedLogic";
import { MutateConfig } from "react-query";
import { useEventContext } from "../context/EventContextProvider";
import { useComplexState } from "../hooks/useComplexState";
import { useDebouncedCallbackVoid } from "../hooks/useDebounce";

export interface ExerciseInstanceDAO extends Basic {
  exerciseId: string;
  eventId: string;
  repetitions?: number;
  weightKg?: number;
  durationSeconds?: number;
}

type ExerciseInstanceDAONew = ExceptAutoSetBasics<ExerciseInstanceDAO>;

export const exerciseInstanceDefaults: ExerciseInstanceDAO = {
  ...BASIC_DEFAULTS,
  exerciseId: "no id yet",
  eventId: "no id yet",
};

// const EXERCISE_INSTANCE_MAKER = (instance: ExerciseInstance, update: ) => {
//   return {
//     ...instance,
//     update:
//   }
// }

// export class ExerciseInstance {
//   data: ExerciseInstanceDAO;
//   constructor({ ...data }: ExerciseInstanceDAO) {
//     this.data = data;
//   }

//   create = useExerciseInstanceContext().create;
// }

// const useExercise

type New = {
  data: ExerciseInstanceDAONew;
  initialMode: ItemModes.New;
};

type Old = {
  data: ExerciseInstanceDAO;
  initialMode: Exclude<ItemModes, ItemModes.New>;
};

type UseExerciseInstanceProps = New | Old;

export const useExerciseInstance = ({
  data,
  initialMode,
}: UseExerciseInstanceProps) => {
  const defaults: Partial<ExerciseInstanceDAO> = {
    _id: "new",
    lastModifiedOn: new Date().toUTCString(),
    createdOn: new Date().toUTCString(),
  };

  const getDataWithDefaults = (
    data: ExerciseInstanceDAONew | ExerciseInstanceDAO
  ) => ({ ...defaults, ...data } as ExerciseInstanceDAO);

  const {
    complexState: dataState,
    setComplexState: setDataState,
    reset,
  } = useComplexState<Old["data"]>(getDataWithDefaults(data));
  const [mode, setMode] = useState(initialMode);
  const EIContext = useExerciseInstanceContext();
  const ExContext = useExerciseContext();
  const EvContext = useEventContext();

  //TODO: fix continuous extra fetches

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintain state, even if global context changes. This allows to create and refeence sub-items in new item */

    if (mode !== ItemModes.New) {
      reset();
    }
  }, [data]);

  const create =
    mode === ItemModes.New
      ? (
          data: ExerciseInstanceDAO = dataState,
          config?: MutateConfig<
            ExerciseInstanceDAO,
            unknown,
            ExerciseInstanceDAO,
            unknown
          >
        ) => EIContext.create(data, config)
      : undefined;

  const update = (
    data: ExerciseInstanceDAO = dataState,
    config?: MutateConfig<
      ExerciseInstanceDAO,
      unknown,
      ExerciseInstanceDAO,
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
    data: ExerciseInstanceDAO = dataState,
    config?: MutateConfig<
      ExerciseInstanceDAO,
      unknown,
      ExerciseInstanceDAO,
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
    data: ExerciseInstanceDAO,
    config?: MutateConfig<
      ExerciseInstanceDAO,
      unknown,
      ExerciseInstanceDAO,
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
      ? (config?: MutateConfig<void, unknown, ExerciseInstanceDAO, unknown>) =>
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
    exercise: ExContext.getOneFromContext(dataState.exerciseId),
    event: EvContext.getOneFromContext(dataState.eventId),
  };
};
