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
import { NutritionContext } from "../../App";
import SearchWithDropdown from "./../generic/SearchWithDropdown";
import { NutritionItemModes } from "./NutritionListItem";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";
import { wait } from "@testing-library/react";

const useStyles = createUseStyles(
  {
    wrapper: {
      margin: "5px",
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
    },
    addSection: {
      display: "flex",
      alignItems: "center",
      padding: "0 5px",
    },
    subheading: {
      display: "flex",
      alignItems: "center",
    },
  },
  { name: "Ingredients" }
);

interface Props {
  activeIngredientIds: NutritionItem["_id"][];
  onAdd: (id: Array<NutritionItem["_id"]>) => void;
  onRemove: (id: NutritionItem["_id"]) => void;
}

const Ingredients = ({ activeIngredientIds, onAdd, onRemove }: Props) => {
  const classes = useStyles();
  const NIContext = useContext(NutritionContext);

  const niMinusAlreadyActive = NIContext.items.filter(
    (ni) => !activeIngredientIds.includes(ni._id)
  );

  const defaultDropdownState = niMinusAlreadyActive.map((ni) => ({
    ni: ni,
    isSelected: false,
  }));

  const [searchInput, setSearchInput] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [dropdownState, setDropdownState] = useState(defaultDropdownState);

  // function handleSelectChage(id: NutritionItem["id"]) {
  //   const newDropdown = dropdownState.map((item) =>
  //     item.ni._id === id ? { ...item, isSelected: !item.isSelected } : item
  //   );
  //   setDropdownState(newDropdown);
  // }

  function handleSelect(id: NutritionItem["_id"]) {
    onAdd([id]);
  }

  async function handleCreateNewFromSearch(title: string) {
    const newNI = new NutritionItem(title);
    console.log("new NI local: " + newNI);

    const tempId = newNI.tempId;
    console.log("tempId from newNi: " + tempId);

    const createResult = await NILogic.API.CREATE(newNI);
    const createdNI: NutritionItem = createResult.item;

    console.log("createdNI");
    console.log(createdNI);

    handleSelect(createdNI._id);
  }

  return (
    <div className={classes.wrapper}>
      {/* <div className={classes.subheading}> Ingredients:</div> */}
      {activeIngredientIds.map(
        (id, index) =>
          NIContext.getOneById(id) && (
            <Removable onRemove={() => onRemove(id)} key={index}>
              <NutritionItemCompact
                item={NIContext.getOneById(id)}
                initialMode={NutritionItemModes.Show}
                refresh={() => NIContext.refresh()}
              />
            </Removable>
          )
      )}
      <div className={classes.addSection}>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={!isAddOpen}>
          <button onClick={() => setIsAddOpen(true)}>+</button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <button
            onClick={() => {
              setIsAddOpen(false);
              setSearchInput("");
            }}
          >
            cancel
          </button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <PickOrAdd
            dropdownItems={dropdownState.map((item) => ({
              id: item.ni._id,
              node: (
                <NutritionItemCompact
                  item={NIContext.getOneById(item.ni._id)}
                  initialMode={NutritionItemModes.Show}
                />
              ),
              isSelected: item.isSelected,
              searchableText: item.ni.title,
            }))}
            onSelect={(id) => handleSelect(id)}
            onCreateNew={handleCreateNewFromSearch}
          />
        </Collapsible>
      </div>
    </div>
  );
};

export default Ingredients;
