import React, { useEffect, useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import { ExerciseTypeContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseType } from "../../logic/exerciseTypeLogic";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import TextWithEdit from "../generic/TextWithEdit";
import TextWithEditAndState from "../generic/TextWithEditAndState";

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
  item: ExerciseType;
  initialMode: ItemModes;
}

const ExerciseRow = ({ item, initialMode }: Props) => {
  const [exercise, setExercise] = useState(item);
  const classes = useStyles();
  const ETContext = useContext(ExerciseTypeContext);
  const [mode, setMode] = useState(initialMode);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintaiexerciseng itemState for New items, even if global context changes. This allows to create new ingredients by adding them to New items */
    if (mode !== ItemModes.New) {
      setExercise(item);
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
    setExercise(item);
  }

  async function handleCreate() {
    ETContext.create(exercise);
    setExercise(item);
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
              <button onClick={() => setExercise(item)}>reset</button>
            </div>
          )}
        </div>
      </td>
      <td>
        <Box>
          <div className={classes.info}>
            {mode === ItemModes.QuickEdit ? (
              <TextWithEditAndState
                text={exercise.title}
                onCommit={(txt: string) => {
                  console.log("onCommit");
                  console.log(txt);
                  const newNI = { ...exercise, title: txt };
                  ETContext.update(newNI);
                }}
              />
            ) : (
              <TextWithEdit
                text={exercise.title}
                className={classes.title}
                isEdit={mode === ItemModes.Edit || mode === ItemModes.New}
                onTextChange={(newText: string) => {
                  setExercise({ ...item, title: newText });
                }}
                onEnter={
                  (mode === ItemModes.New && (() => handleCreate())) ||
                  (mode === ItemModes.Edit && (() => handleSave())) ||
                  (() => console.log("on enter not available for this mode"))
                }
              />
            )}
          </div>
        </Box>
      </td>
      <td>
        {mode !== ItemModes.New && (
          <button onClick={() => ETContext.delete(exercise)}>delete</button>
        )}
      </td>
    </tr>
  );
};

export { ExerciseRow };
