import React, { useEffect, useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  ExerciseRepsContext,
  ExerciseRepsProvider,
} from "../../../context/ExerciseRepsContextProvider";
import { ExerciseReps } from "../../../logic/exerciseRepsLogic";
import { ItemModes } from "../../../utils/utils";
import { Box } from "../../generic/styling/Box";

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

interface Props {
  item: ExerciseReps;
  initialMode: ItemModes;
}

const ExerciseRepsRow = ({ item, initialMode }: Props) => {
  const [exerciseReps, setExerciseReps] = useState(item);
  const classes = useStyles();
  const exerciseRepsContext = useContext(ExerciseRepsContext);
  const [mode, setMode] = useState(initialMode);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintain itemState for New items, even if global context changes. This allows to create new ingredients by adding them to New items */
    if (mode !== ItemModes.New) {
      setExerciseReps(item);
    }
  }, [item]);

  // TODO: extract save, cancel, create to hook

  function handleSave() {
    exerciseRepsContext.update(exerciseReps);
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
  }

  function handleCancel() {
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
    setExerciseReps(item);
  }

  async function handleCreate() {
    exerciseRepsContext.create(exerciseReps);
    setExerciseReps(item);
  }

  function updateReps(value: number) {
    const newReps = { ...exerciseReps, repetitions: value };
    if (mode === ItemModes.QuickEdit) {
      exerciseRepsContext.update(newReps);
    } else {
      setExerciseReps(newReps);
    }
  }

  return (
    <tr className={classes.outerWrapper}>
      <td>
        <div className={classes.buttons}>
          {mode === ItemModes.Show && (
            <button onClick={() => setMode(ItemModes.Edit)}>edit</button>
          )}
          {mode === ItemModes.Edit && (
            <div>
              <button onClick={() => handleSave()}>save</button>
              <button onClick={() => handleCancel()}>cancel</button>
            </div>
          )}
          {mode === ItemModes.New && (
            <div>
              <button onClick={() => handleCreate()}>create</button>
              <button onClick={() => setExerciseReps(item)}>reset</button>
            </div>
          )}
        </div>
      </td>
      <td>
        <Box>
          <div className={classes.info}>{exerciseReps.exerciseId}</div>
        </Box>
      </td>
      <td>
        <input
          type={"number"}
          value={exerciseReps.repetitions}
          onChange={(e) => updateReps(parseInt(e.target.value))}
        />
      </td>
      <td>
        {mode !== ItemModes.New && (
          <button onClick={() => exerciseRepsContext.delete(exerciseReps)}>
            delete
          </button>
        )}
      </td>
    </tr>
  );
};

export { ExerciseRepsRow };
