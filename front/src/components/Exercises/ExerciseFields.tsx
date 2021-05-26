import React, { ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { createContextDefined } from "../../context/ContextWrapper";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import TextWithEdit from "../generic/TextWithEdit";
import { ExerciseTypeData } from "shared";
import { useExercise } from "../../logic/exerciseLogic";

const useStyles = createUseStyles(
  {},

  { name: "ExerciseFields" }
);

const [useThisContext, Provider] =
  createContextDefined<ReturnType<typeof useExercise>>();

export interface ExerciseTypeFieldProps {
  item: ExerciseTypeData;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ item, initialMode, children }: ExerciseTypeFieldProps) => {
  const contextProps = useExercise({ data: item, initialMode });

  return <Provider value={contextProps}>{children}</Provider>;
};

const Buttons = ({ className }: { className?: string }) => {
  const { mode, create, reset, update, setMode } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={() => create?.()}
      onReset={reset}
      onSave={() => update?.()}
      onCancelEdit={reset}
      onSetMode={setMode}
      className={className}
      valid
    />
  );
};

const Title = ({ className }: { className?: string }) => {
  const { mode, data, setOrUpdateDebounced } = useThisContext();

  return (
    <TextWithEdit
      text={data.title}
      onTextChange={(txt) => setOrUpdateDebounced({ ...data, title: txt })}
      isEdit={mode !== ItemModes.Show}
      className={className}
    />
  );
};

const Delete = () => {
  const { remove, mode } = useThisContext();

  return <DeleteButton onDelete={() => remove?.()} mode={mode} />;
};

const ExerciseFields = { Wrapper, Buttons, Title, Delete };

export { ExerciseFields };
