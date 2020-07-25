import React, { useContext } from "react";
import { useState } from "react";
import {
  NutritionItem,
  NILogic,
  NutritionItemAPI,
} from "../../logic/nutrition/NutritionLogic";
import Removable from "./../generic/Removable";
import NutritionItemCompact from "./NutritionItemCompact";
import { createUseStyles } from "react-jss";
import { NutritionContext } from "../../context/NIContext";
import { NutritionItemModes } from "./NITableRow";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";
import { AnimatePresence, motion } from "framer-motion";

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
  parent: NutritionItem;
  onAdd: (id: NutritionItem["_id"]) => void;
  onRemove: (id: NutritionItem["_id"]) => void;
}

const Ingredients = ({ parent, onAdd, onRemove }: Props) => {
  const NIContext = useContext(NutritionContext);
  const classes = useStyles();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const dropdownItems = NIContext.all;
  // .filter(
  //   (item) => item._id !== parent._id && !parent.ingredientIds.includes(item._id)
  // );

  async function handleCreateNewFromSearch(title: string) {
    const newNI = new NutritionItem(title);
    const createResult = await NILogic.API.CREATE(newNI);
    const createdNI: NutritionItem = createResult.item;
    onAdd(createdNI._id);
  }

  return (
    <div className={classes.wrapper}>
      {parent.ingredientIds.map((id, index) => (
        <AnimatePresence key={id} initial={false}>
          {NIContext.getOneById(id) && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              transition={{ duration: 0.15 }}
              variants={{
                open: { opacity: 1, width: "auto" },
                collapsed: { opacity: 0, width: 0 },
              }}
            >
              <Removable onRemove={() => onRemove(id)} key={index}>
                <NutritionItemCompact
                  item={NIContext.getOneById(id)}
                  initialMode={NutritionItemModes.Show}
                  refresh={() => NIContext.refresh()}
                />
              </Removable>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <div className={classes.addSection}>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={!isAddOpen}>
          <button onClick={() => setIsAddOpen(true)}>+</button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <button onClick={() => setIsAddOpen(false)}>cancel</button>
        </Collapsible>
        <Collapsible animation={Animations.ExpandWidth} isExpanded={isAddOpen}>
          <PickOrAdd
            dropdownItems={dropdownItems.map((item) => ({
              id: item._id,
              node: (
                <NutritionItemCompact
                  key={item._id}
                  item={NIContext.getOneById(item._id)}
                  initialMode={NutritionItemModes.Show}
                />
              ),
              isSelected: false,
              searchableText: item.title,
            }))}
            onSelect={(id) => onAdd(id)}
            onCreateNew={handleCreateNewFromSearch}
          />
        </Collapsible>
      </div>
    </div>
  );
};

export default Ingredients;
