import React, { useEffect, useContext, useState } from "react";
import contextGeneratorFn, { ContextProps } from "../context/ContextGenerator";
import { ItemModes } from "../utils/utils";
import { updateObject } from "./updateObject";
import { useComplexState } from "./useComplexState";

type AnyWithId = any & {
  _id: string;
};

export const useEntityBase = (
  item: AnyWithId,
  contextSource: React.Context<any>,
  initialMode: ItemModes
) => {
  const context: ContextProps<typeof item> = useContext(contextSource);
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
    await context.update(item);
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
    console.log("handleCreate");

    await context.create(item);
    reset();
  }

  async function handleUpdate(newProps: Partial<typeof item>) {
    const newObject = updateObject(item)(newProps);
    await context.update(newObject);
  }

  async function handleDelete() {
    await context.delete(complexState._id);
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
  };
};
