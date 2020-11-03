import React, { ReactNode, useMemo } from "react";
import { createUseStyles } from "react-jss";
import {
  EntityBaseContextUseQuery,
  useEntityBaseUseQuery,
} from "../../common/useEntityBase";
import { createContextDefined } from "../../context/ContextWrapper";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseType } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import TextWithEdit from "../generic/TextWithEdit";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseFields" }
);

const [useThisContext, Provider] = createContextDefined<
  EntityBaseContextUseQuery<ExerciseType>
>();

export interface ExerciseTypeFieldProps {
  item: ExerciseType;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ item, initialMode, children }: ExerciseTypeFieldProps) => {
  const contextProps = useEntityBaseUseQuery(
    item,
    useExerciseContext(),
    initialMode
  );

  const { handleUpdate, handleCreate, handleDelete } = contextProps;

  return <Provider value={contextProps}>{children}</Provider>;
};

const Buttons = () => {
  const {
    mode,
    handleCreate,
    reset,
    handleSave,
    handleCancel,
    setMode,
  } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={handleCreate}
      onReset={reset}
      onSave={handleSave}
      onCancel={handleCancel}
      onSetMode={setMode}
      valid
    />
  );
};

const Title = () => {
  const { mode, complexState, handleSetOrUpdate } = useThisContext();

  return (
    <TextWithEdit
      text={complexState.title}
      onTextChange={(txt) => handleSetOrUpdate({ title: txt })}
      isEdit={mode !== ItemModes.Show}
    />
  );
};

const SomeNumber = () => {
  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  return (
    <input
      disabled={mode === ItemModes.Show}
      type={"number"}
      value={complexState.someNumber}
      key={"check"}
      onChange={(e: React.ChangeEvent<any>) =>
        handleSetOrUpdate({ someNumber: parseInt(e.target.value) })
      }
    />
  );
};

const Delete = () => {
  const { handleDelete, mode } = useThisContext();

  return <DeleteButton onDelete={handleDelete} mode={mode} />;
};

const Exercise = { Wrapper, Buttons, Title, SomeNumber, Delete };

export { Exercise };
