import React from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { Box } from "../generic/styling/Box";
import TextWithEdit from "../generic/TextWithEdit";
import TextWithEditAndState from "../generic/TextWithEditAndState";

const useStyles = createUseStyles(
  {
    info: {
      padding: "5px",
      display: "flex",
      justifyContent: "center",
    },
    textField: {
      display: "flex",
      alignItems: "center",
    },
  },
  { name: "NutritionListItem" }
);

interface Props {
  mode: ItemModes;
  text: string;
  onUpdate: (text: string) => void;
  onCreate?: () => void;
  onSave?: () => void;
  onSet: (text: string) => void;
}

// TODO: replace with stateless modeless simpler component to leverage handleSetOrUpdate

export const TextWithModes = ({
  mode,
  text,
  onUpdate,
  onCreate,
  onSave,
  onSet,
}: Props) => {
  const classes = useStyles();

  return (
    <Box>
      <div className={classes.info}>
        {mode === ItemModes.QuickEdit ? (
          <TextWithEditAndState
            text={text}
            onCommit={(txt: string) => {
              onUpdate(txt);
            }}
          />
        ) : (
          <TextWithEdit
            text={text}
            className={classes.textField}
            isEdit={mode === ItemModes.Edit || mode === ItemModes.New}
            onTextChange={onSet}
            onEnter={
              (mode === ItemModes.New && onCreate && (() => onCreate())) ||
              (mode === ItemModes.Edit && onSave && (() => onSave())) ||
              (() => console.log("on enter not available for this mode"))
            }
          />
        )}
      </div>
    </Box>
  );
};
