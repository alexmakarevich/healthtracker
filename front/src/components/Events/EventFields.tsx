import React, { HTMLProps, ReactNode } from "react";
import { Event, useEvent } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { createContextDefined } from "../../context/ContextWrapper";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import { InputDateTime } from "../generic/inputs/DateTimeInputs/InputDateTime";
import { EventData } from "shared";

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
