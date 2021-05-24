import React, { HTMLProps, ReactNode } from "react";
import { Event, EventData, useEvent } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { createUseStyles } from "react-jss";
import { createContextDefined } from "../../context/ContextWrapper";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import { InputDateTime } from "../generic/inputs/DateTimeInputs/InputDateTime";

//  experimental file for playing around with the fields structure

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
  event: EventData;
  initialMode: ItemModes;
  children: ReactNode;
  onChange?: (event: EventData) => any;
}

const [useThisContext, Provider] = createContextDefined<Event>();

const Wrapper = ({ event, initialMode, children }: EventFieldProps) => {
  const contextProps: Event = useEvent({ data: event, initialMode });

  const ProviderWrapper = ({ children }: { children: ReactNode }) => (
    <Provider value={{ ...contextProps }}>{children}</Provider>
  );

  // return <Provider value={{ ...contextProps, onChange }}>{children}</Provider>;
  return { ProviderWrapper, someProps: "someValue", event: contextProps };
};

const Buttons = () => {
  const { mode, create, reset, setMode, update } = useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={() => create?.()}
      onReset={reset}
      onSave={update}
      onCancelEdit={reset}
      onSetMode={setMode}
      valid
    />
  );
};

const DateTime = (
  props: HTMLProps<HTMLInputElement> & {
    onCreateSuccess?: (event: EventData) => any;
  }
) => {
  const { setOrUpdateDebounced, data: event } = useThisContext();

  const time = new Date(event.time);

  function changeDateTime(newDateTime: Date) {
    setOrUpdateDebounced({ ...event, time: newDateTime.toISOString() });
  }

  return <InputDateTime date={time} onChange={changeDateTime} />;
};

const Delete = () => {
  const { remove, mode } = useThisContext();

  return <DeleteButton onDelete={() => remove} mode={mode} />;
};

/**
 * experimental file for playing around with the fields structure
 */

export const EventFieldsAlt = {
  Wrapper,
  Buttons,
  DateTime,
  Delete,
};
