import React, { HTMLProps, ReactNode } from "react";
import { Event, EventData, useEvent } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { createUseStyles } from "react-jss";
import { createContextDefined } from "../../context/ContextWrapper";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
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
  event: EventData;
  initialMode: ItemModes;
  children: ReactNode;
  onChange?: (event: EventData) => any;
}

const [useThisContext, Provider] = createContextDefined<Event>();

const WrapperAndHook = ({ event, initialMode, children }: EventFieldProps) => {
  const contextProps: Event = useEvent({ data: event, initialMode });

  const ProviderWrapper = (
    <Provider value={{ ...contextProps }}>{children}</Provider>
  );

  return { ProviderWrapper, event: contextProps };
};

const Wrapper = ({ event, initialMode, children }: EventFieldProps) => {
  const contextProps: Event = useEvent({ data: event, initialMode });
  return <Provider value={{ ...contextProps }}>{children}</Provider>;
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

  return <DeleteButton onDelete={() => remove?.()} mode={mode} />;
};

const EventFields = {
  WrapperAndHook,
  Wrapper,
  Buttons,
  DateTime,
  Delete,
};

export { EventFields };
