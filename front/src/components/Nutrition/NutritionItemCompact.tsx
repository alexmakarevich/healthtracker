import React, { useEffect } from "react";
import { useState } from "react";
import { NutritionItem } from "../../logic/nutritionItemLogic";
import TextWithEdit from "../generic/TextWithEdit";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import { useComplexState } from "../../common/useComplexState";

const useStyles = createUseStyles({
  wrapper: {
    background: "#84b0d9",
    margin: "5px",
    padding: "5px 7px",
  },
});

interface Props {
  item: NutritionItem;
  initialMode: ItemModes;
  refresh?: () => void;
}

const NutritionItemCompact = ({ item, initialMode, refresh }: Props) => {
  const {
    complexState: nutritionItem,
    setComplexState: setNutritionItem,
  } = useComplexState(item);

  const [mode, setMode] = useState(initialMode);

  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <TextWithEdit
        text={nutritionItem.title}
        isEdit={mode === ItemModes.Edit || mode === ItemModes.New}
        onTextChange={(newText: string) => {
          setNutritionItem({ title: newText });
        }}
      />
    </Box>
  );
};

export default NutritionItemCompact;
