import React, { ReactNode, useMemo } from "react";
import { createUseStyles } from "react-jss";
import {
  EntityBaseContextUseQuery,
  useEntityBaseUseQuery,
} from "../../hooks/useEntityBase";
import { createContextDefined } from "../../context/ContextWrapper";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseTypeDAO } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import {
  CreateEditResetCancel,
  CreateEditResetCancelProps,
} from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import TextWithEdit from "../generic/TextWithEdit";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseFields" }
);

const [useThisContext, Provider] = createContextDefined<
  EntityBaseContextUseQuery<ExerciseTypeDAO>
>();

export interface ExerciseTypeFieldProps {
  item: ExerciseTypeDAO;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ item, initialMode, children }: ExerciseTypeFieldProps) => {
  const contextProps = useEntityBaseUseQuery(
    item,
    useExerciseContext(),
    initialMode
  );

  return <Provider value={contextProps}>{children}</Provider>;
};

const Buttons = ({ className }: { className?: string }) => {
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
      onCancelEdit={handleCancel}
      onSetMode={setMode}
      className={className}
      valid
    />
  );
};

const Title = ({ className }: { className?: string }) => {
  const { mode, complexState, handleSetOrUpdate } = useThisContext();

  return (
    <TextWithEdit
      text={complexState.title}
      onTextChange={(txt) => handleSetOrUpdate({ title: txt })}
      isEdit={mode !== ItemModes.Show}
      className={className}
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

export { Exercise as ExerciseFields };
