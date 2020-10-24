import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
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

export const useExerciseTypeProps = ({
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
    handleSetOrUpdate,
    reset,
  } = useEntityBase(item, ExerciseTypeContext, initialMode);

  const { title, someNumber } = complexState;

  const buttonsProps = {
    mode,
    handleCreate,
    handleCancel,
    reset,
    handleSave,
    setMode,
  };

  const Buttons = useMemo(
    () => ({
      mode,
      handleCancel,
      handleCreate,
      handleSave,
      reset,
      setMode,
    }: typeof buttonsProps) => (
      <CreateEditResetCancel
        mode={mode}
        onCreate={handleCreate}
        onReset={reset}
        onSave={handleSave}
        onCancel={handleCancel}
        onSetMode={setMode}
      />
    ),
    []
  );

  const titleProps = {
    mode: mode,
    text: title,
    onUpdate: (text: string) => handleUpdate({ title: text }),
    onCreate: handleCreate,
    onSet: (text: string) => setComplexState({ title: text }),
    onSave: handleSave,
  };

  const Title = useMemo(() => (props: any) => <TextWithModes {...props} />, []);

  const someNumberProps = {
    type: "number",
    value: someNumber,
    key: "check",
    onChange: (e: React.ChangeEvent<any>) =>
      handleSetOrUpdate({ someNumber: parseInt(e.target.value) }),
  };

  const SomeNumber = useMemo(
    () => (props: typeof someNumberProps) => <input {...props} />,
    []
  );

  const deleteProps = {
    mode: mode,
    onDelete: handleDelete,
  };

  const Delete = useMemo(() => (props: any) => <DeleteButton {...props} />, []);

  const Exercise = { Buttons, Title, SomeNumber, Delete };

  return {
    deleteProps,
    someNumberProps,
    buttonsProps,
    titleProps,
    Exercise,
  };
};
