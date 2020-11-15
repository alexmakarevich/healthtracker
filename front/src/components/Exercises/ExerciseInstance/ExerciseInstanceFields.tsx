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
  {
    input: {
      width: "40px",
    },
    repsInput: {
      width: "32px",
    },
    weightInput: {
      width: "32px",
    },
    durationInput: {
      width: "48px",
    },
  },

  { name: "ExerciseFields" }
);

export interface ExerciseInstanceProps {
  item: ExerciseInstance;
  initialMode: ItemModes;
  children: ReactNode;
  onCreate?: (item: ExerciseInstance) => void;
}

const [useThisContext, Provider] = createContextDefined<
  EntityBaseContextUseQuery<ExerciseInstance>
>();

const Wrapper = ({
  item,
  initialMode,
  children,
  onCreate,
}: ExerciseInstanceProps) => {
  const contextProps = useEntityBaseUseQuery(
    item,
    useExerciseInstanceContext(),
    initialMode,
    onCreate
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
      onCreate={() => {
        const created = handleCreate();
        console.log("onCreate", created);
      }}
      onReset={reset}
      onSave={handleSave}
      onCancel={handleCancel}
      onSetMode={setMode}
      valid
    />
  );
};

const Repetitions = () => {
  const classes = useStyles();

  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  if (mode === ItemModes.Show && !complexState.repetitions) {
    return null;
  } else {
    return (
      <div>
        <input
          disabled={mode === ItemModes.Show}
          type={"number"}
          value={complexState.repetitions ?? 0}
          key={"check"}
          className={classes.repsInput}
          onChange={(e: React.ChangeEvent<any>) =>
            handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
          }
        />
        <div>reps</div>
      </div>
    );
  }
};

const Weight = () => {
  const classes = useStyles();

  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  if (mode === ItemModes.Show && !complexState.weightKg) {
    return null;
  } else {
    return (
      <div>
        <input
          disabled={mode === ItemModes.Show}
          type={"number"}
          value={complexState.weightKg}
          key={"check"}
          className={classes.weightInput}
          onChange={(e: React.ChangeEvent<any>) =>
            handleSetOrUpdate({ weightKg: parseInt(e.target.value) })
          }
        />
        <div>kg</div>
      </div>
    );
  }
};

const Duration = () => {
  const classes = useStyles();

  const { complexState, handleSetOrUpdate, mode } = useThisContext();

  if (mode === ItemModes.Show && !complexState.durationSeconds) {
    return null;
  } else {
    return (
      <div>
        <input
          disabled={mode === ItemModes.Show}
          type={"number"}
          value={complexState.durationSeconds}
          key={"check"}
          className={classes.durationInput}
          onChange={(e: React.ChangeEvent<any>) =>
            handleSetOrUpdate({ durationSeconds: parseInt(e.target.value) })
          }
        />
        <div>sec</div>
      </div>
    );
  }
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
        <button onClick={() => setShowSelect(!showSelect)}>
          {!showSelect ? "change" : "cancel"}
        </button>
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
