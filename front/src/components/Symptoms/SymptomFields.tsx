import React, { ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { SymptomData } from "shared";
import { createContextDefined } from "../../context/ContextWrapper";
import { useSymptom } from "../../logic/symptomLogic";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import TextWithEdit from "../generic/TextWithEdit";

const useStyles = createUseStyles(
  {
    outerWrapper: {
      margin: "5px",
      width: "100%",
    },
    info: {
      padding: "5px",
      display: "flex",
      justifyContent: "center",
    },
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
  },
  { name: "SymptomFields" }
);

const [useThisContext, Provider] =
  createContextDefined<ReturnType<typeof useSymptom>>();

export interface SymptomFieldsProps {
  data: SymptomData;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({ data, initialMode, children }: SymptomFieldsProps) => {
  const contextProps = useSymptom({
    data,
    initialMode,
  });

  return <Provider value={contextProps}>{children}</Provider>;
};

const Buttons = () => {
  const { mode, data, create, reset, update, setMode } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={() => create && create(data)}
      onReset={reset}
      onSave={update}
      onCancelEdit={() => setMode(ItemModes.Show)}
      onSetMode={setMode}
      isFlexRow
      valid
    />
  );
};

const Title = () => {
  const { mode, data, setOrUpdateDebounced } = useThisContext();

  return (
    <TextWithEdit
      text={data.title}
      onTextChange={(txt) => setOrUpdateDebounced({ ...data, title: txt })}
      isEdit={mode !== ItemModes.Show}
    />
  );
};

const Delete = () => {
  const { remove, mode } = useThisContext();
  return <DeleteButton onDelete={() => remove && remove()} mode={mode} />;
};

export const SymptomFields = { Wrapper, Buttons, Title, Delete };
