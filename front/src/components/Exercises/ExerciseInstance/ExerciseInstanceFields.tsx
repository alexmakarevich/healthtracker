import React, { ReactNode, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  EntityBaseContextUseQuery,
  useEntityBaseUseQuery,
} from "../../../common/useEntityBase";
import { createContextDefined } from "../../../context/ContextWrapper";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import {
  ExerciseInstance,
  exerciseInstanceDefaults,
} from "../../../logic/exerciseInstanceLogic";
import { exerciseTypeDefaults } from "../../../logic/exerciseTypeLogic";
import { ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";
import PickOrAdd from "../../generic/PickOrAdd";
import { Box } from "../../generic/styling/Box";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseFields" }
);

const [useThisContext, Provider] = createContextDefined<
  EntityBaseContextUseQuery<ExerciseInstance>
>();

export interface ExerciseInstanceProps {
  item: ExerciseInstance;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ item, initialMode, children }: ExerciseInstanceProps) => {
  const contextProps = useEntityBaseUseQuery(
    item,
    useExerciseInstanceContext(),
    initialMode
  );

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

const Repetitions = () => {
  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  return (
    <input
      disabled={mode === ItemModes.Show}
      type={"number"}
      value={complexState.repetitions ?? 0}
      key={"check"}
      onChange={(e: React.ChangeEvent<any>) =>
        handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
      }
    />
  );
};

const Weight = () => {
  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  return (
    <>
      <input
        disabled={mode === ItemModes.Show}
        type={"number"}
        value={complexState.weightKg}
        key={"check"}
        onChange={(e: React.ChangeEvent<any>) =>
          handleSetOrUpdate({ weightKg: parseInt(e.target.value) })
        }
      />
      Kg
    </>
  );
};

const Duration = () => {
  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  return (
    <>
      <input
        disabled={mode === ItemModes.Show}
        type={"number"}
        value={complexState.durationSeconds}
        key={"check"}
        onChange={(e: React.ChangeEvent<any>) =>
          handleSetOrUpdate({ durationSeconds: parseInt(e.target.value) })
        }
      />
      Sec
    </>
  );
};

const Exercise = () => {
  const { complexState, handleSetOrUpdate } = useThisContext();

  const exCtx = useExerciseContext();

  const exercise = exCtx.getOneFromContext(complexState.exerciseId);

  const [showSelect, setShowSelect] = useState(
    complexState.exerciseId === exerciseInstanceDefaults.exerciseId
  );

  const dropdownItems = exCtx.all?.map((exercise) => ({
    id: exercise._id,
    isSelected: false,
    searchableText: exercise.title,
    node: <Box>{exercise.title}</Box>,
  }));

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span> {exercise?.title}</span>
      {showSelect && (
        <PickOrAdd
          dropdownItems={dropdownItems}
          onSelect={(id: string) => {
            handleSetOrUpdate({ exerciseId: id });
            setShowSelect(false);
          }}
          onCreateNew={(title) =>
            exCtx.create({ ...exerciseTypeDefaults, title: title })
          }
        />
      )}
      {complexState.exerciseId !== exerciseInstanceDefaults.exerciseId && (
        <button onClick={() => setShowSelect(!showSelect)}>/</button>
      )}
    </div>
  );
};

const Delete = () => {
  const { handleDelete, mode } = useThisContext();

  return <DeleteButton onDelete={handleDelete} mode={mode} />;
};

const ExerciseInstanceFields = {
  Wrapper,
  Buttons,
  Exercise,
  Repetitions,
  Weight,
  Duration,
  Delete,
};

export { ExerciseInstanceFields };
