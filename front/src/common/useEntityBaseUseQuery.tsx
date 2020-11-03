import React, { useEffect, useContext, useState } from "react";
import { WithId } from "../api/apiGenerator";
import { ContextProps } from "../context/generateContextUseQuery";

import { ItemModes } from "../utils/utils";
import { updateObject } from "./updateObject";
import { useComplexState } from "./useComplexState";

export function useEntityBaseUseQuery<I extends WithId>(
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

  function handleCancel() {
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
    reset();
  }

  function handleCreate() {
    let toReturn: boolean = false;
    context.create(complexState, {
      onSuccess: () => {
        // context.refresh();
        reset();
        console.log("create", complexState);
        toReturn = true;
      },
      onError: () => console.log("Cannot create", complexState),
    });
    if (toReturn) {
      return complexState;
    }
  }

  function handleUpdate(newProps: Partial<I>) {
    const newObject = updateObject(complexState)(newProps);
    context.update(newObject, {
      onSuccess: () => {
        context.refresh();
        console.log("update", newObject);
      },
      onError: () => console.log("Cannot update", newObject),
    });
  }

  async function handleSave() {
    handleUpdate(complexState);
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
  }

  async function handleDelete() {
    // TODO: remove bad id
    context.delete(
      // { ...complexState, _id: "1111a73b70fbbc1e602b620c" },
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

export interface EntityBaseContextUseQuery<Item> {
  complexState: Item;
  setComplexState: React.Dispatch<Partial<Item>>;
  mode: ItemModes;
  setMode: React.Dispatch<React.SetStateAction<ItemModes>>;
  handleCreate: () => Item | undefined;
  handleCancel: () => void;
  handleUpdate: (newProps: Partial<Item>) => void;
  handleSave: () => void;
  handleDelete: () => void;
  reset: () => void;
  handleSetOrUpdate: (newProps: Partial<Item>) => Promise<void>;
}
