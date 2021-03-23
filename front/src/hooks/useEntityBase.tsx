import React, { useEffect, useState } from "react";
import { WithId } from "../common/types/types";
import { updateObject } from "../common/updateObject";
import { ContextProps } from "../context/generateContext";

import { ItemModes } from "../utils/utils";
import { useComplexState } from "./useComplexState";
import {
  useDebounceCallbackFromValue,
  useDebouncedCallbackVoid,
} from "./useDebounce";

export function useEntityBaseUseQuery<I extends WithId>(
  item: I,
  contextSource: ContextProps<I>,
  initialMode: ItemModes,
  onCreate?: (i: I) => void
) {
  const context: ContextProps<I> = contextSource;
  const [mode, setMode] = useState(initialMode);
  const { complexState, setComplexState, reset } = useComplexState(item);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintain state, even if global context changes. This allows to create and refeence sub-items in new item */

    if (mode !== ItemModes.New) {
      reset();
    }
  }, [item]);

  function handleCancel() {
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
    reset();
  }

  function handleCreate(partialIem?: Partial<I>) {
    const itemToCreate = { ...complexState, ...partialIem };

    context.create(itemToCreate, {
      onSuccess: (data) => {
        reset();
        console.log("create", data);
        onCreate && onCreate(data);
      },
      onError: () => console.log("Cannot create", complexState),
    });
  }

  function handleUpdate(newProps: Partial<I>) {
    const newObject = updateObject(complexState)(newProps);
    context.update(newObject, {
      onSuccess: () => {
        context.refresh();
      },
      onError: () => console.log("Cannot update", newObject),
    });
  }

  function handleSave() {
    handleUpdate(complexState);
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
  }

  function handleDelete() {
    context.delete(
      { ...complexState },

      {
        onSuccess: () => {
          context.refresh();
          console.log("onSuccess");
        },
        onError: (error: unknown) => {
          console.log("onError:", error);
        },
        throwOnError: true,
      }
    );
  }

  function handleDebouncedSetOrUpdate(newProps: Partial<I>) {
    if (mode === ItemModes.QuickEdit) {
      handleUpdate(newProps);
    } else {
      setComplexState(newProps);
    }
  }

  function handleSetOrUpdate(newProps: Partial<I>) {
    if (mode === ItemModes.QuickEdit) {
      handleDebouncedUpdate(newProps);
    } else {
      setComplexState(newProps);
    }
  }

  const debouncedUpdate = useDebouncedCallbackVoid(handleUpdate, 750);

  function handleDebouncedUpdate(newProps: Partial<I>) {
    setComplexState(newProps);
    debouncedUpdate(newProps);
  }

  return {
    complexState,
    setComplexState,
    reset,
    mode,
    setMode,
    context,
    handleSave,
    handleCancel,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSetOrUpdate,
    handleDebouncedUpdate,
    handleDebouncedSetOrUpdate,
  };
}

export interface EntityBaseContextUseQuery<Item> {
  complexState: Item;
  setComplexState: React.Dispatch<Partial<Item>>;
  mode: ItemModes;
  setMode: React.Dispatch<React.SetStateAction<ItemModes>>;
  handleCreate: (partialItem?: Partial<Item>) => void;
  handleCancel: () => void;
  handleUpdate: (newItem: Partial<Item>) => void;
  handleDebouncedUpdate: (newItem: Partial<Item>) => void;
  /** TODO: replace partial with complete item */
  handleSave: () => void;
  handleDelete: () => void;
  reset: () => void;
  handleSetOrUpdate: (newProps: Partial<Item>) => void;
  handleDebouncedSetOrUpdate: (newProps: Partial<Item>) => void;
}
