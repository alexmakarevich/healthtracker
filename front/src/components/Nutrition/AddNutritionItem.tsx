import React from "react";
import { NutritionItemData, nutritionItemDefaults } from "shared";
import { createUseStyles } from "react-jss";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import PickOrAdd from "../generic/PickOrAdd";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import { NutritionFields } from "./NutritionFields";

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
  onAdd: (id: NutritionItemData["_id"]) => void;
}

const AddNutritionItem = ({ idsToExclude, onAdd }: Props) => {
  const NIContext = NutritionItemContext.use();
  const classes = useStyles();

  function handleCreateAndAdd(title: string) {
    const newNI: NutritionItemData = { ...nutritionItemDefaults, title: title };
    NIContext.create(newNI, {
      onSuccess: (data) => {
        onAdd(data._id);
        console.log("add ni", data._id);
        NIContext.refresh();
      },
    });
  }

  const dropdownItemIds = NIContext.all?.filter(
    (item) => item._id && !idsToExclude?.includes(item._id)
  );

  return (
    <div className={classes.wrapper}>
      <PickOrAdd
        dropdownItems={dropdownItemIds?.map((item) => {
          return {
            id: item._id,
            node: (
              <Box>
                <NutritionFields.Wrapper
                  data={item}
                  initialMode={ItemModes.Show}
                >
                  <NutritionFields.Title />
                </NutritionFields.Wrapper>
              </Box>
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
