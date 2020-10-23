import React, { useEffect, useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import { useComplexState } from "../../common/useComplexState";
import { useEntityBase } from "../../common/useEntityBase";
import { ExerciseTypeContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseType } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import { TextWithModes } from "../EntityElements/TextWithModes";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseFields" }
);

export interface ExerciseTypeFieldProps {
  item: ExerciseType;
  initialMode: ItemModes;
}

export const useExerciseFields = ({
  item,
  initialMode,
}: ExerciseTypeFieldProps) => {
  const {
    complexState,
    mode,
    setMode,
    handleCreate,
    handleCancel,
    handleUpdate,
    handleSave,
    handleDelete,
    setComplexState,
    reset,
  } = useEntityBase(item, ExerciseTypeContext, initialMode);

  const { title } = complexState;

  const Title = () => (
    <TextWithModes
      mode={mode}
      text={title}
      onUpdate={(text) => handleUpdate({ title: text })}
      onCreate={handleCreate}
      onSet={(text) => setComplexState({ title: text })}
      onSave={handleSave}
    />
  );

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

  const Delete = () => <DeleteButton mode={mode} onDelete={handleDelete} />;

  return { Title, Buttons, Delete };
};
