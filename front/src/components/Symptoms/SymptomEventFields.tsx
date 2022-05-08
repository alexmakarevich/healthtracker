import React, { HTMLProps, ReactNode, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  EventData,
  eventDefaults,
  symptomDefaults,
  SymptomEventData,
  symptomEventDefaults,
} from "shared";
import { createContextDefined } from "../../context/ContextWrapper";
import { useSymptomEvent } from "../../logic/symptomEventLogic";
import { ItemModes } from "../../utils/utils";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../EntityElements/Delete";
import { EventFields } from "../Events/EventFields";
import { Event } from "../../logic/eventLogic";
import { SymptomContext } from "../../context/SymptomContextProvider";
import { Box } from "../generic/styling/Box";
import { Theme } from "../../styling/theme";
import { Button } from "../generic/buttons/Button";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";
import { Icon, IconSizes } from "../generic/styling/Icon";

const useStyles = createUseStyles(
  (theme: Theme) => ({
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
    symptomWrapper: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    symptomButton: {
      marginLeft: "0.5em",
    },
    newsymptomButton: {
      position: "absolute",
      left: "100%",
      top: 0,
      background: theme.good,
      zIndex: 50,
    },
  }),
  { name: "SymptomEventFields" }
);

const [useThisContext, Provider] = createContextDefined<
  ReturnType<typeof useSymptomEvent> & { event: Event }
>();

export interface SymptomFieldsProps {
  data: SymptomEventData;
  initialMode: ItemModes;
  children: ReactNode;
  newEvent?: EventData;
}

const Wrapper = ({ data, initialMode, children }: SymptomFieldsProps) => {
  const contextProps = useSymptomEvent({
    data,
    initialMode,
  });

  const { eventData } = contextProps;

  const { ProviderWrapper, event } = EventFields.WrapperAndHook({
    event: eventData ?? eventDefaults,
    initialMode: contextProps.eventData ? ItemModes.QuickEdit : ItemModes.New,
    children,
  });

  return (
    <Provider value={{ ...contextProps, event }}>{ProviderWrapper}</Provider>
  );
};

const Buttons = () => {
  const { mode, data, create, reset, update, setMode, event } =
    useThisContext();
  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={() =>
        create
          ? event.mode === ItemModes.New
            ? event.create?.(undefined, {
                onSuccess: (newEvent) =>
                  create(
                    { ...data, eventId: newEvent._id },
                    { onError: () => event.remove?.(), onSuccess: reset }
                  ),
              })
            : create
          : () => {}
      }
      onReset={reset}
      onSave={update}
      onCancelEdit={() => setMode(ItemModes.Show)}
      onSetMode={setMode}
      isFlexRow
      valid
    />
  );
};

const EventField = () => <EventFields.DateTime />;

const Symptom = (props?: HTMLProps<HTMLDivElement>) => {
  const { data, symptomData, setOrUpdate } = useThisContext();
  const { className, ...otherDivProps } = props ?? { className: "" };

  const sCtx = SymptomContext.use();
  const classes = useStyles();

  const [showSelect, setShowSelect] = useState(
    data.symptomId === symptomEventDefaults.symptomId
  );

  const areNoneSelected = useMemo(() => !symptomData, [symptomData]);

  const dropdownItems = sCtx.all?.map((symptom) => ({
    id: symptom._id,
    isSelected: false,
    searchableText: symptom.title,
    node: <Box>{symptom.title}</Box>,
  }));

  return (
    <div className={className} {...otherDivProps}>
      <div className={classes.symptomWrapper}>
        <span> {symptomData?.title}</span>
        {data.symptomId !== symptomEventDefaults.symptomId && (
          <Button
            onClick={() => setShowSelect(!showSelect)}
            className={classes.symptomButton}
          >
            <Icon icon={showSelect ? "undo" : "pen"} size={IconSizes.S} />
          </Button>
        )}
      </div>
      <Collapsible
        isExpanded={areNoneSelected || showSelect}
        animation={Animations.ExpandHeight}
      >
        <PickOrAdd
          dropdownItems={dropdownItems}
          onSelect={(id) => {
            setOrUpdate({ ...data, symptomId: id });
            setShowSelect(false);
          }}
          onCreateNew={(title) =>
            sCtx.create(
              { ...symptomDefaults, title },
              {
                onSuccess: (newsymptom) => {
                  console.log({ newsymptom });
                  setOrUpdate({ ...data, symptomId: newsymptom._id });
                  setShowSelect(false);
                },
              }
            )
          }
          createButtonContent={"new symptom"}
          inputProps={{
            placeholder: "enter symptom name...",
          }}
        />
      </Collapsible>
    </div>
  );
};

const Strength = ({ className }: { className?: string }) => {
  const { mode, data, setOrUpdateDebounced } = useThisContext();

  return (
    <input
      disabled={mode === ItemModes.Show}
      type={"number"}
      min={0}
      max={10}
      value={data.strength ?? 0}
      key={"check"}
      className={className}
      onChange={(e: React.ChangeEvent<any>) =>
        setOrUpdateDebounced({ ...data, strength: parseInt(e.target.value) })
      }
    />
  );
};

const Delete = () => {
  const { remove, mode } = useThisContext();
  return <DeleteButton onDelete={() => remove && remove()} mode={mode} />;
};

export const SymptomEventFields = {
  Wrapper,
  Buttons,
  EventField,
  Symptom,
  Strength,
  Delete,
};
