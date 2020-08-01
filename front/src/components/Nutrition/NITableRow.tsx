import React, { useEffect, useContext } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NILogic,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import useObjectState from "../../common/useObjectState";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import Ingredients from "./Ingredients";
import TextWithEditAndState from "../generic/TextWithEditAndState";

const useStyles = createUseStyles(
  {
    outerWrapper: {
      margin: "5px",
      width: "100%",
    },
    innerWrapper: {
      background: "#84d9b0",
      borderRadius: "10px",
      padding: "10px",
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

export enum NutritionItemModes {
  Show,
  Edit,
  QuickEdit,
  New,
}

interface Props {
  item: NutritionItem;
  initialMode: NutritionItemModes;
}

const NITableRow = ({ item, initialMode }: Props) => {
  const [ni, setNi] = useState(item);
  const classes = useStyles();
  const NIContext = useContext(NutritionItemContext);
  const [mode, setMode] = useState(initialMode);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    console.log("useEffect called");
    /* maintaining itemState for New items, even if global context changes. This allows to create new ingredients by adding them to New items */
    if (mode !== NutritionItemModes.New) {
      setNi(item);
    }
  }, [item]);

  function handleSave() {
    NIContext.update(ni);
    if (mode === NutritionItemModes.Edit) {
      setMode(NutritionItemModes.Show);
    }
  }

  function handleCancel() {
    if (mode === NutritionItemModes.Edit) {
      setMode(NutritionItemModes.Show);
    }
    setNi(item);
  }

  async function handleCreate() {
    NIContext.create(ni);
    setNi(item);
  }

  function addIngredient(id: string) {
    if (mode !== NutritionItemModes.New) {
      const newNI = NILogic.add_ingredient(ni, id);
      NIContext.update(newNI);
    } else if (mode === NutritionItemModes.New) {
      const newNI = NILogic.add_ingredient(ni, id);
      setNi(newNI);
    }
  }

  function removeIngredient(id: string) {
    if (mode !== NutritionItemModes.New) {
      const newNI = NILogic.remove_ingredient(ni, id);
      NIContext.update(newNI);
    } else if (mode === NutritionItemModes.New) {
      const newNI = NILogic.remove_ingredient(ni, id);
      setNi(newNI);
    }
  }

  return (
    <tr className={classes.outerWrapper}>
      <td>
        <div className={classes.buttons}>
          {mode === NutritionItemModes.Show && (
            <button onClick={() => setMode(NutritionItemModes.Edit)}>
              edit
            </button>
          )}
          {mode === NutritionItemModes.Edit && (
            <div>
              <button onClick={() => handleSave()}>save</button>
              <button onClick={() => handleCancel()}>cancel</button>
            </div>
          )}
          {mode === NutritionItemModes.New && (
            <div>
              <button onClick={() => handleCreate()}>create</button>
              <button onClick={() => setNi(item)}>reset</button>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className={classes.innerWrapper}>
          <div className={classes.info}>
            {mode === NutritionItemModes.QuickEdit ? (
              <TextWithEditAndState
                text={ni.title}
                onCommit={(txt: string) => {
                  console.log("onCommit");
                  console.log(txt);
                  const newNI = { ...ni, title: txt };
                  NIContext.update(newNI);
                }}
              />
            ) : (
              <TextWithEdit
                text={ni.title}
                className={classes.title}
                isEdit={
                  mode === NutritionItemModes.Edit ||
                  mode === NutritionItemModes.New
                }
                onTextChange={(newText: string) => {
                  setNi({ ...item, title: newText });
                }}
                onEnter={
                  (mode === NutritionItemModes.New && (() => handleCreate())) ||
                  (mode === NutritionItemModes.Edit && (() => handleSave())) ||
                  (() => console.log("on enter not available for this mode"))
                }
              />
            )}
          </div>
        </div>
      </td>
      <td>
        <Ingredients
          parent={ni}
          onAdd={(id) => addIngredient(id)}
          onRemove={(id) => removeIngredient(id)}
        />
      </td>
      <td>
        {mode !== NutritionItemModes.New && (
          <button onClick={() => NIContext.delete(ni._id)}>delete</button>
        )}
      </td>
    </tr>
  );
};

export default NITableRow;
