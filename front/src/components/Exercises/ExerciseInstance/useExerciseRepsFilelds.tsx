import React, { useEffect, useContext, useState, useRef, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { useEntityBase } from "../../../common/useEntityBase";
import { useRepsContext } from "../../../context/ExerciseInstanceContextProvider";
import { ExerciseInstance } from "../../../logic/exerciseInstanceLogic";
import { ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseRepsFields" }
);

export interface ExerciseRepsFieldProps {
  item: ExerciseInstance;
  initialMode: ItemModes;
}

export const useExerciseRepsFields = ({
  item,
  initialMode,
}: ExerciseRepsFieldProps) => {
  const {
    complexState,
    mode,
    setMode,
    handleCreate,
    handleCancel,
    handleSetOrUpdate,
    handleSave,
    handleDelete,
    reset,
  } = useEntityBase(item, useRepsContext(), initialMode);

  const { repetitions, exerciseId, durationSeconds, weightKg } = complexState;

  const Buttons = () => {
    return (
      <CreateEditResetCancel
        mode={mode}
        onCreate={handleCreate}
        onCancel={handleCancel}
        onReset={reset}
        onSave={handleSave}
        onSetMode={setMode}
        valid={!!exerciseId}
      />
    );
  };

  const Repetitions = useMemo(
    () => () => (
      <input
        type={"number"}
        value={repetitions}
        onChange={(e: React.ChangeEvent<any>) =>
          handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
        }
      />
    ),
    []
  );

  const ExerciseId = useMemo(
    () => () => (
      <input
        type={"text"}
        defaultValue={exerciseId}
        onChange={(e: React.ChangeEvent<any>) =>
          handleSetOrUpdate({ exerciseId: e.target.value })
        }
      />
    ),
    []
  );

  const Delete = () => <DeleteButton mode={mode} onDelete={handleDelete} />;

  return { Buttons, Delete, Repetitions, ExerciseId };
};
