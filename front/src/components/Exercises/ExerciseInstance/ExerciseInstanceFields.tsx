import React, { ReactNode, useMemo } from "react";
import { createUseStyles } from "react-jss";
import {
  EntityBaseContext,
  useEntityBase,
} from "../../../common/useEntityBase";
import { createContextDefined } from "../../../context/ContextWrapper";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import {
  ExerciseInstance,
  exerciseInstanceDefaults,
} from "../../../logic/exerciseInstanceLogic";
import {
  ExerciseType,
  exerciseTypeDefaults,
} from "../../../logic/exerciseTypeLogic";
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
  EntityBaseContext<ExerciseInstance>
>();

export interface ExerciseInstanceProps {
  item: ExerciseInstance;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ item, initialMode, children }: ExerciseInstanceProps) => {
  const contextProps = useEntityBase(
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
      value={complexState.repetitions}
      key={"check"}
      onChange={(e: React.ChangeEvent<any>) =>
        handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
      }
    />
  );
};

const ExerciseId = () => {
  const { complexState } = useThisContext();

  return <div>{complexState.exerciseId}</div>;
};

const Exercise = () => {
  const { complexState, setComplexState, handleSetOrUpdate } = useThisContext();

  const exCtx = useExerciseContext();

  const exercise = exCtx.getOneFromContext(complexState.exerciseId);

  const dropdownItems = exCtx.all.map((exercise) => ({
    id: exercise._id,
    isSelected: false,
    searchableText: exercise.title,
    node: <Box>{exercise.title}</Box>,
  }));

  return (
    <div>
      <span> {exercise?.title}</span>
      <button>/</button>
      {complexState.exerciseId === exerciseInstanceDefaults.exerciseId && (
        <PickOrAdd
          dropdownItems={dropdownItems}
          onSelect={(id: string) => setComplexState({ exerciseId: id })}
          onCreateNew={(title) =>
            exCtx.create({ ...exerciseTypeDefaults, title: title })
          }
        />
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
  ExerciseId,
  Exercise,
  Repetitions,
  Delete,
};

export { ExerciseInstanceFields };
