import React, {
  HTMLProps,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { EventDAO, eventDefaults, eventLogic } from "../../logic/eventLogic";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import AddNutritionItem from "../Nutrition/AddNutritionItem";
import Removable from "../generic/Removable";
import { ItemModes, splitArray } from "../../utils/utils";
import { createUseStyles } from "react-jss";
import Collapsible, { Animations } from "../generic/Collapsible";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { createContextDefined } from "../../context/ContextWrapper";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import { NutritionFields } from "../Nutrition/NutritionFields";
import { Box } from "../generic/styling/Box";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { ExerciseInstanceFields } from "../Exercises/ExerciseInstance/ExerciseInstanceFields";
import PickOrAdd from "../generic/PickOrAdd";
import { ExerciseFields } from "../Exercises/ExerciseFields";
import { SimpleRow } from "../generic/layout/SimpleRow";
import { exerciseInstanceDefaults } from "../../logic/exerciseInstanceLogic";
import { FlexRow } from "../generic/layout/FlexRow";
import {
  EntityBaseContextUseQuery,
  useEntityBaseUseQuery,
} from "../../hooks/useEntityBase";
import { InputDateTime } from "../generic/inputs/DateTimeInputs/InputDateTime";

// TODO: deprecate or rewrite with parent/child logic between events and instances moved into instances,
// i.e. instead of interating of "children" field of event, use "eventid" field in and exercise instance, or nutrition instance

const styles = () => ({
  itemsWrapper: {
    display: "flex",
    alignItems: "center",
  },
  removeButton: {
    background: "#ee3333",
    display: "flex",
    alignItems: "center",
    height: "25px",
    width: "25px",
    color: "white",
    borderRadius: "50%",
    border: "none",
    justifyContent: "center",
  },
  item: {
    flexGrow: 0,
    padding: [0, 3],
  },
  exerciseBox: {
    padding: 4,
  },
});

const useStyles = createUseStyles(styles, { name: "EventTableRow" });

interface EventFieldProps {
  event: EventDAO;
  initialMode: ItemModes;
  children: ReactNode;
  onChange?: (event: EventDAO) => any;
}

const [useThisContext, Provider] = createContextDefined<
  EntityBaseContextUseQuery<EventDAO> & { onChange?: (event: EventDAO) => any }
>();

const Wrapper = ({
  event,
  initialMode,
  children,
  onChange,
}: EventFieldProps) => {
  const contextProps = useEntityBaseUseQuery(
    event,
    useEventContext(),
    initialMode
  );

  useEffect(() => {
    contextProps.setComplexState(event);
  }, [event]);

  return <Provider value={{ ...contextProps, onChange }}>{children}</Provider>;
};

const Buttons = () => {
  const {
    mode,
    handleCreate,
    reset,
    handleSave,
    handleCancel,
    setMode,
  } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={handleCreate}
      onReset={reset}
      onSave={handleSave}
      onCancelEdit={handleCancel}
      onSetMode={setMode}
      valid
    />
  );
};

const DateTime = (
  props: HTMLProps<HTMLInputElement> & {
    onCreateSuccess?: (event: EventDAO) => any;
  }
) => {
  const { handleSetOrUpdate, complexState: event, onChange } = useThisContext();

  const time = new Date(event.time);

  function changeDateTime(newDateTime: Date) {
    onChange?.({ ...event, time: newDateTime.toISOString() });
    handleSetOrUpdate({ time: newDateTime.toISOString() });
  }

  return <InputDateTime date={time} onChange={changeDateTime} />;
};

const Delete = () => {
  const { handleDelete, mode } = useThisContext();

  return <DeleteButton onDelete={handleDelete} mode={mode} />;
};

const EventFields = {
  Wrapper,
  Buttons,
  DateTime,
  Delete,
};

export { EventFields };
