import React, { useEffect, useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import { useEntityBase } from "../../../common/useEntityBase";
import { ExerciseRepsContext } from "../../../context/ExerciseRepsContextProvider";
import { ExerciseReps } from "../../../logic/exerciseRepsLogic";
import { ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseRepsFields" }
);

export interface ExerciseRepsFieldProps {
  item: ExerciseReps;
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
    handleUpdate,
    handleSetOrUpdate,
    handleSave,
    handleDelete,
    setComplexState,
    reset,
  } = useEntityBase(item, ExerciseRepsContext, initialMode);

  const { repetitions, exerciseId } = complexState;

  const Buttons = () => {
    return (
      <CreateEditResetCancel
        mode={mode}
        onCreate={handleCreate}
        onCancel={handleCancel}
        onReset={reset}
        onSave={handleSave}
        onSetMode={setMode}
      />
    );
  };

  const Repetitions = () => (
    <input
      type={"number"}
      value={repetitions}
      onChange={(e) =>
        handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
      }
    />
  );

  const Delete = () => <DeleteButton mode={mode} onDelete={handleDelete} />;

  return { Buttons, Delete, Repetitions };
};
