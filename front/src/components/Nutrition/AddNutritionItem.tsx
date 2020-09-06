import React, { useContext } from "react";
import {
  NutritionItem,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import PickOrAdd from "../generic/PickOrAdd";
import { ItemModes } from "../../utils/utils";

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
  idsToExclude?: string[];
  onAdd: (id: NutritionItem["_id"]) => void;
}

const AddNutritionItem = ({ idsToExclude, onAdd }: Props) => {
  const NIContext = useContext(NutritionItemContext);
  const classes = useStyles();

  async function handleCreateAndAdd(title: string) {
    const newNI: NutritionItem = { ...nutritionItemDefaults, title: title };
    const createResult = await NIContext.create(newNI);
    const createdNI: NutritionItem = createResult.item;
    onAdd(createdNI._id);
  }

  const dropdownItems = NIContext.all.filter(
    (item) => item._id && !idsToExclude?.includes(item._id)
  );

  return (
    <div className={classes.wrapper}>
      <PickOrAdd
        dropdownItems={dropdownItems.map((item) => ({
          id: item._id,
          node: (
            <NutritionItemCompact
              key={item._id}
              item={NIContext.getOneFromContext(item._id)}
              initialMode={ItemModes.Show}
            />
          ),
          isSelected: false,
          searchableText: item.title,
        }))}
        onSelect={onAdd}
        onCreateNew={handleCreateAndAdd}
      />
    </div>
  );
};

export default AddNutritionItem;
