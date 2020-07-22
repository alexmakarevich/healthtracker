import React, { useEffect, useContext } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NutritionItemAPI,
  NILogic,
} from "../../logic/nutrition/NutritionLogic";
import useObjectState from "../../common/useObjectState";
import TextWithEdit from "./../generic/TextWithEdit";
import Removable from "./../generic/Removable";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { TestContext, NutritionContext } from "../../App";
import SelectList from "./../generic/SelectList";
import SearchWithDropdown from "./../generic/SearchWithDropdown";

const useStyles = createUseStyles({
  wrapper: {
    background: "#84d9b0",
    borderRadius: "10px",
    margin: "10px",
    padding: "5px",
  },
  info: {
    width: "100%",
    padding: "5px",
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  buttons: {
    width: "100%",
    padding: "5px",

    "& > div": {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      "& > button": {
        flexGrow: 1,
      },
    },
  },
});

export enum NutritionItemModes {
  Show,
  Edit,
  New,
}

interface Props {
  item: NutritionItem;
  initialMode: NutritionItemModes;
}

const NutritionListItem = ({ item, initialMode }: Props) => {
  const {
    obj: itemState,
    setObj: setItemState,
    updateProperty: updateItemProperty,
    resetObj: resetItemState,
  }: {
    obj: NutritionItem;
    setObj: any;
    updateProperty: any;
    resetObj: any;
  } = useObjectState(item);

  const {
    items: allNIfromContext,
    getOneById: NIfromContextById,
    refresh: refreshNIContext,
  } = useContext(NutritionContext);

  const [mode, setMode] = useState(initialMode);

  const [ingredients, setIngredients]: [NutritionItem[], Function] = useState(
    []
  );

  const [ingredientSearch, setIngredientSearch] = useState("");

  useEffect(() => {
    setItemState(item);
    readAllIngredients();
  }, [item]);

  const classes = useStyles();

  async function readIngredient(id: string) {
    const ingredient: NutritionItem = await NutritionItemAPI.READ_BY_ID(id);
    return ingredient;
  }

  async function readAllIngredients() {
    console.log("readAllIngredients called");

    asyncForEach(itemState.ingredientIds, async (id: any) => {
      const ingredient: NutritionItem = await NutritionItemAPI.READ_BY_ID(id);
      console.log("ingredient: ", ingredient);

      setIngredients([...ingredients, ingredient]);
    });
  }

  async function asyncForEach(array: Array<any>, callback: Function) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  function handleSave() {
    NutritionItemAPI.UPDATE_BY_ID(itemState).then(() => refreshNIContext());
    setMode(NutritionItemModes.Show);
  }

  function handleCancel() {
    setMode(NutritionItemModes.Show);
    resetItemState();
  }

  function handleDelete() {
    NutritionItemAPI.DELETE_BY_ID(itemState._id).then(() => refreshNIContext());
  }

  function handleCreate() {
    NutritionItemAPI.CREATE(itemState).then(() => refreshNIContext());
  }

  function handleReset() {
    resetItemState();
  }

  const testNI = new NutritionItem("ttt");
  console.log(testNI.addIngredient("5f0b512d689c0030e06cff5e"));

  return (
    <div className={classes.wrapper}>
      <div className={classes.info}>
        <TextWithEdit
          text={itemState.title}
          className={classes.title}
          isEdit={
            mode === NutritionItemModes.Edit || mode === NutritionItemModes.New
          }
          handleChange={(newText: string) => {
            updateItemProperty("title", newText);
          }}
          onEnter={
            mode === NutritionItemModes.New
              ? () => handleCreate()
              : mode === NutritionItemModes.Edit
              ? () => handleSave()
              : () => {}
          }
        />
        {itemState.ingredientIds.map(
          (id: string) =>
            NIfromContextById(id) && (
              <Removable>
                <NutritionItemCompact
                  item={NIfromContextById(id)}
                  initialMode={NutritionItemModes.Show}
                  refresh={() => refreshNIContext()}
                  onRemove={(id) =>
                    setItemState(
                      NILogic.Transformations.remove_ingredient(itemState, id)
                    )
                  }
                />
              </Removable>
            )
        )}
        <SearchWithDropdown
          dropdownItems={allNIfromContext.map((ni) => ({
            id: ni._id,
            node: (
              <NutritionItemCompact
                item={NIfromContextById(ni._id)}
                initialMode={NutritionItemModes.Show}
                onRemove={(id) => console.log(id)}
              />
            ),
            selected: false,
            searchableText: ni.title,
          }))}
          searchTextValue={ingredientSearch}
          onSearchChange={(value) => setIngredientSearch(value)}
          onSelectChange={(id) => console.log(id)}
        />
      </div>
      <div className={classes.buttons}>
        {mode === NutritionItemModes.Show && (
          <div>
            <button onClick={() => setMode(NutritionItemModes.Edit)}>
              edit
            </button>
            <button onClick={() => handleDelete()}>delete</button>
          </div>
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
            <button onClick={() => handleReset()}>reset</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionListItem;
