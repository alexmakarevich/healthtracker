import React, { useEffect, useContext, useState } from "react";
import { WithId } from "../api/apiGenerator";
import { ContextProps } from "../context/generateDefinedContext";

import { ItemModes } from "../utils/utils";
import { updateObject } from "./updateObject";
import { useComplexState } from "./useComplexState";

export function useEntityBase<I extends WithId>(
  item: I,
  contextSource: ContextProps<I>,
  initialMode: ItemModes
) {
  const context: ContextProps<I> = contextSource;
  const [mode, setMode] = useState(initialMode);
  const { complexState, setComplexState, reset } = useComplexState(item);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintaiexerciseng itemState for New items, even if global context changes. This allows to create new ingredients by adding them to New items */
    if (mode !== ItemModes.New) {
      reset();
    }
  }, [item]);

  async function handleSave() {
    await context.update(complexState);
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
  }

  function handleCancel() {
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
    reset();
  }

  async function handleCreate() {
    await context.create(complexState);
    reset();
  }

  async function handleUpdate(newProps: Partial<I>) {
    const newObject = updateObject(complexState)(newProps);
    await context.update(newObject);
  }

  async function handleDelete() {
    await context.delete(complexState);
  }

  async function handleSetOrUpdate(newProps: Partial<I>) {
    if (mode === ItemModes.QuickEdit) {
      handleUpdate(newProps);
    } else {
      setComplexState(newProps);
    }
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
  };
}

export interface EntityBaseContext<Item> {
  complexState: Item;
  setComplexState: React.Dispatch<Partial<Item>>;
  mode: ItemModes;
  setMode: React.Dispatch<React.SetStateAction<ItemModes>>;
  handleCreate: () => Promise<void>;
  handleCancel: () => void;
  handleUpdate: (newProps: Partial<Item>) => Promise<void>;
  handleSave: () => void;
  handleDelete: () => void;
  reset: () => void;
  handleSetOrUpdate: (newProps: Partial<Item>) => Promise<void>;
}
