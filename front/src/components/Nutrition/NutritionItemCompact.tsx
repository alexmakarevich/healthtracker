import React, { useEffect } from "react";
import { useState } from "react";
import { NutritionItem } from "../../logic/nutritionItemLogic";
import useObjectState from "../../common/useObjectState";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    background: "#84b0d9",
    borderRadius: "5px",
    margin: "5px",
    padding: "5px 7px",
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
  refresh?: () => void;
}

const NutritionItemCompact = ({ item, initialMode, refresh }: Props) => {
  // console.log("ni compact");
  // console.log(item);

  const {
    obj: itemState,
    setObj: setItemState,
    updateProperty: updateItemProperty,
    resetObj: resetItemState,
    ...rest
  }: {
    obj: NutritionItem;
    setObj: any;
    updateProperty: any;
    resetObj: any;
  } = useObjectState(item);

  const [mode, setMode] = useState(initialMode);

  const classes = useStyles();

  return (
    <div className={classes.wrapper} {...rest}>
      <TextWithEdit
        text={item.title}
        isEdit={
          mode === NutritionItemModes.Edit || mode === NutritionItemModes.New
        }
        handleChange={(newText: string) => {
          updateItemProperty("title", newText);
        }}
      />
    </div>
  );
};

export default NutritionItemCompact;
