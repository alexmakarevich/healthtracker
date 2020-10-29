import React from "react";
import {
  NutritionItem,
  nutritionItemDefaults,
} from "../../logic/nutritionItemLogic";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import PickOrAdd, { SearchableSelectChild } from "../generic/PickOrAdd";
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
  const NIContext = useNutritionItemContext();
  const classes = useStyles();

  async function handleCreateAndAdd(title: string) {
    const newNI: NutritionItem = { ...nutritionItemDefaults, title: title };
    const createResult = await NIContext.create(newNI);
    createResult && onAdd(createResult._id);
  }

  const dropdownItemIds = NIContext.all.filter(
    (item) => item._id && !idsToExclude?.includes(item._id)
  );

  // const dropdownItems: SearchableSelectChild[] | undefined = dropdownItemIds.map((id) => NIContext.getOneFromContext(id))

  return (
    <div className={classes.wrapper}>
      <PickOrAdd
        dropdownItems={dropdownItemIds.map((item) => {
          return {
            id: item._id,
            node: (
              <NutritionItemCompact
                key={item._id}
                item={item}
                initialMode={ItemModes.Show}
              />
            ),
            isSelected: false,
            searchableText: item.title,
          };
        })}
        onSelect={onAdd}
        onCreateNew={handleCreateAndAdd}
      />
    </div>
  );
};

export default AddNutritionItem;
