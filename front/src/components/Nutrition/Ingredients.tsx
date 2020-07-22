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
import { Collapsible } from "../generic/Collapsible";

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
  ids: NutritionItem["_id"][];
  onAdd?: (id: NutritionItem["_id"]) => void;
  onRemove: (id: NutritionItem["_id"]) => void;
}

const Ingredients = ({ ids, onAdd, onRemove }: Props) => {
  const classes = useStyles();
  const {
    items: allNIfromContext,
    getOneById: NIfromContextById,
    refresh: refreshNIContext,
  } = useContext(NutritionContext);

  const [searchInput, setSearchInput] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className={classes.wrapper}>
      <div className={classes.subheading}> Ingredients:</div>
      {ids.map(
        (id) =>
          NIfromContextById(id) && (
            <Removable onRemove={() => onRemove(id)}>
              <NutritionItemCompact
                item={NIfromContextById(id)}
                initialMode={NutritionItemModes.Show}
                refresh={() => refreshNIContext()}
              />
            </Removable>
          )
      )}
      <div className={classes.addSection}>
        <Collapsible isExpanded={!isAddOpen}>
          <button onClick={() => setIsAddOpen(true)}>+</button>
        </Collapsible>
        <Collapsible isExpanded={isAddOpen}>
          <button
            onClick={() => {
              setIsAddOpen(false);
              setSearchInput("");
            }}
          >
            cancel
          </button>
        </Collapsible>
        <Collapsible isExpanded={isAddOpen}>
          <SearchWithDropdown
            dropdownItems={allNIfromContext.map((ni) => ({
              id: ni._id,
              node: (
                <NutritionItemCompact
                  item={NIfromContextById(ni._id)}
                  initialMode={NutritionItemModes.Show}
                />
              ),
              selected: false,
              searchableText: ni.title,
            }))}
            searchTextValue={searchInput}
            onSearchChange={(value) => setSearchInput(value)}
            onSelectChange={(id) => console.log(id)}
          />
        </Collapsible>
      </div>
    </div>
  );
};

export default Ingredients;
