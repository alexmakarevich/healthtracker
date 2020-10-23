import React, { useEffect, useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import { useComplexState } from "../../common/useComplexState";
import { ExerciseTypeContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseType } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { TextWithModes } from "../EntityElements/TextWithModes";

const useStyles = createUseStyles(
  {
    outerWrapper: {
      margin: "5px",
      width: "100%",
    },
    info: {
      padding: "5px",
      display: "flex",
      justifyContent: "center",
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    buttons: {
      padding: "5px",

      "& > div": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        "& > button": {
          flexGrow: 1,
        },
      },
    },
  },
  { name: "NutritionListItem" }
);

export interface ExerciseTypeFieldProps {
  item: ExerciseType;
  initialMode: ItemModes;
}

export const useExerciseFields = ({
  item,
  initialMode,
}: ExerciseTypeFieldProps) => {
  const classes = useStyles();
  const ETContext = useContext(ExerciseTypeContext);
  const [mode, setMode] = useState(initialMode);

  const {
    state: exercise,
    setComplexState: setExercise,
    reset,
  } = useComplexState(item);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintaiexerciseng itemState for New items, even if global context changes. This allows to create new ingredients by adding them to New items */
    if (mode !== ItemModes.New) {
      reset();
    }
  }, [item]);

  function handleSave() {
    ETContext.update(exercise);
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
  }

  function handleCancel() {
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
    reset();
  }

  async function handleCreate() {
    ETContext.create(exercise);
    reset();
  }

  const Title = () => (
    <TextWithModes
      mode={mode}
      text={exercise.title}
      onUpdate={(text) => ETContext.update({ ...exercise, title: text })}
      onCreate={handleCreate}
      onSet={(text) => setExercise({ title: text })}
      onSave={handleSave}
    />
  );

  const Buttons = () => {
    return (
      <CreateEditResetCancel
        mode={mode}
        onCreate={handleCreate}
        onCancel={handleCancel}
        onReset={() => setExercise(item)}
        onSave={handleSave}
        onSetMode={setMode}
      />
    );
  };

  const Delete = () =>
    mode !== ItemModes.New ? (
      <button onClick={() => ETContext.delete(exercise._id)}>delete</button>
    ) : (
      <></>
    );

  return { Title, Buttons, Delete };
};
