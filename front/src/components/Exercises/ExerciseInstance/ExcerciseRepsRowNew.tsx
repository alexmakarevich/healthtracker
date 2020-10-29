import React, { useEffect, useContext, useState, useRef } from "react";
import { createUseStyles } from "react-jss";
import { useEntityBase } from "../../../common/useEntityBase";
import { useRepsContext } from "../../../context/ExerciseInstanceContextProvider";
import { ExerciseInstance } from "../../../logic/exerciseInstanceLogic";
import { ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";
import { useExerciseRepsFields } from "./useExerciseRepsFilelds";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseRepsFields" }
);

export interface ExerciseRepsFieldProps {
  item: ExerciseInstance;
  initialMode: ItemModes;
}

export const ExerciseRepsRowNew = ({
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
  } = useEntityBase(item, useRepsContext(), initialMode);

  const { repetitions, exerciseId } = complexState;

  const { Buttons, Delete, Repetitions } = useExerciseRepsFields({
    item: item,
    initialMode: mode,
  });

  return (
    <tr>
      <td>
        <CreateEditResetCancel
          mode={mode}
          onCreate={handleCreate}
          onCancel={handleCancel}
          onReset={reset}
          onSave={handleSave}
          onSetMode={setMode}
          valid
        />
      </td>
      <td>
        <input
          type={"number"}
          key={"check"}
          value={repetitions}
          pattern={"[0-9]*"}
          onChange={(e) =>
            handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
          }
        />
      </td>
      <td>
        <DeleteButton mode={mode} onDelete={handleDelete} />
      </td>
    </tr>
  );
};
