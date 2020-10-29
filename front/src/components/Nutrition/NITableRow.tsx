import React, { useEffect } from "react";
import { useState } from "react";
import { NutritionItem, NILogic } from "../../logic/nutritionItemLogic";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import Ingredients from "./Ingredients";
import TextWithEditAndState from "../generic/TextWithEditAndState";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";

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
  item: NutritionItem;
  initialMode: ItemModes;
}

const NITableRow = ({ item, initialMode }: Props) => {
  const [ni, setNi] = useState(item);
  const classes = useStyles();
  const NIContext = useNutritionItemContext();

  const [mode, setMode] = useState(initialMode);

  // any time the passed item changes (e.g. when it's refreshed in context, update the state here)
  useEffect(() => {
    /* maintaining itemState for New items, even if global context changes. This allows to create new ingredients by adding them to New items */
    if (mode !== ItemModes.New) {
      setNi(item);
    }
  }, [item]);

  function handleSave() {
    NIContext.update(ni);
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
  }

  function handleCancel() {
    if (mode === ItemModes.Edit) {
      setMode(ItemModes.Show);
    }
    setNi(item);
  }

  async function handleCreate() {
    NIContext.create(ni);
    setNi(item);
  }

  function addIngredient(id: string) {
    if (mode !== ItemModes.New) {
      const newNI = NILogic.add_ingredient(ni, id);
      NIContext.update(newNI);
    } else if (mode === ItemModes.New) {
      const newNI = NILogic.add_ingredient(ni, id);
      setNi(newNI);
    }
  }

  function removeIngredient(id: string) {
    if (mode !== ItemModes.New) {
      const newNI = NILogic.remove_ingredient(ni, id);
      NIContext.update(newNI);
    } else if (mode === ItemModes.New) {
      const newNI = NILogic.remove_ingredient(ni, id);
      setNi(newNI);
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
              <button onClick={() => setNi(item)}>reset</button>
            </div>
          )}
        </div>
      </td>
      <td>
        <Box>
          <div className={classes.info}>
            {mode === ItemModes.QuickEdit ? (
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
                isEdit={mode === ItemModes.Edit || mode === ItemModes.New}
                onTextChange={(newText: string) => {
                  setNi({ ...item, title: newText });
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
        <Ingredients
          parent={ni}
          onAdd={(id) => addIngredient(id)}
          onRemove={(id) => removeIngredient(id)}
        />
      </td>
      <td>
        {mode !== ItemModes.New && (
          <button onClick={() => NIContext.delete(ni)}>delete</button>
        )}
      </td>
    </tr>
  );
};

export default NITableRow;
