import React, { HTMLProps, ReactNode, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import { ItemModes } from "../../utils/utils";
import { createContextDefined } from "../../context/ContextWrapper";
import {
  NutritionEvent,
  useNutritionEvent,
} from "../../logic/nutritionEventLogic";
import { CreateEditResetCancel } from "../EntityElements/CreateEditResetCancel";
import { Event } from "../../logic/eventLogic";
import { EventFields } from "../Events/EventFields";
import { Button } from "../generic/buttons/Button";
import Collapsible, { Animations } from "../generic/Collapsible";
import PickOrAdd from "../generic/PickOrAdd";
import { Box } from "../generic/styling/Box";
import { Icon, IconSizes } from "../generic/styling/Icon";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import { DeleteButton } from "../EntityElements/Delete";
import { Theme } from "../../styling/theme";
import {
  eventDefaults,
  NutritionEventData,
  nutritionEventDefaults,
  nutritionItemDefaults,
} from "shared";

const useStyles = createUseStyles(
  (theme: Theme) => ({
    buttons: {
      flexDirection: "row",
    },
    input: {
      width: "40px",
    },
    repsInput: {
      width: "32px",
    },
    weightInput: {
      width: "32px",
    },
    durationInput: {
      width: "48px",
    },
    nutritionWrapper: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    nutritionButton: {
      marginLeft: "0.5em",
    },
    newNutritionButton: {
      position: "absolute",
      left: "100%",
      top: 0,
      background: theme.good,
      zIndex: 50,
    },
  }),
  { name: "NutritionEventFields" }
);

const [useThisContext, Provider] = createContextDefined<
  NutritionEvent & { event: Event }
>();
export interface NutritionEventFieldsProps {
  data: NutritionEventData;
  initialMode: ItemModes;
  children: ReactNode;
}

const Wrapper = ({
  data,
  initialMode,
  children,
}: NutritionEventFieldsProps) => {
  const nutritionEvent = useNutritionEvent({
    data,
    initialMode,
  });

  const { eventData } = nutritionEvent;

  const { ProviderWrapper, event } = EventFields.WrapperAndHook({
    event: eventData ?? eventDefaults,
    initialMode: eventData ? ItemModes.QuickEdit : ItemModes.New,
    children,
  });

  return (
    <Provider value={{ ...nutritionEvent, event }}>{ProviderWrapper}</Provider>
  );
};

const Buttons = () => {
  const { mode, data, event, create, reset, update, setMode } =
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

const EventField = (inputProps: HTMLProps<HTMLInputElement>) => (
  <EventFields.DateTime />
);

// TODO: implement fix below - same for other events
// const EventField = (inputProps: HTMLProps<HTMLInputElement>) =>
//  {
//   const { event, eventData, data } = useThisContext();
//   const eventDataAlt = Event.useContext().getOneFromContext(data._id);

//   return (
//     <div>
//       {/* -{eventData?.time ?? "nope"}
//       <br /> */}
//       {/* {event.data.time} */}
//       {/* <EventFields.DateTime /> */}
//       <EventFields.Wrapper
//         event={eventData ?? eventDefaults}
//         initialMode={ItemModes.QuickEdit}
//       >
//         <EventFields.DateTime />
//       </EventFields.Wrapper>
//     </div>
//   );
// };

const Nutrition = (divProps: HTMLProps<HTMLDivElement>) => {
  const { data, nutritionData: nutrition, setOrUpdate } = useThisContext();
  const { className, ...otherDivProps } = divProps;

  const nutritionCtx = NutritionItemContext.use();
  const classes = useStyles();

  const [showSelect, setShowSelect] = useState(
    data.nutritionId === nutritionEventDefaults.nutritionId
  );

  const areNoneSelected = useMemo(() => !nutrition, [nutrition]);

  const dropdownItems = nutritionCtx.all?.map((nutirition) => ({
    id: nutirition._id,
    isSelected: false,
    searchableText: nutirition.title,
    node: <Box>{nutirition.title}</Box>,
  }));

  return (
    <div className={className} {...otherDivProps}>
      <div className={classes.nutritionWrapper}>
        <span> {nutrition?.title}</span>
        {data.nutritionId !== nutritionEventDefaults.nutritionId && (
          <Button
            onClick={() => setShowSelect(!showSelect)}
            className={classes.nutritionButton}
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
            setOrUpdate({ ...data, nutritionId: id });
            setShowSelect(false);
          }}
          onCreateNew={(title) =>
            nutritionCtx.create(
              { ...nutritionItemDefaults, title },
              {
                onSuccess: (newNutrition) => {
                  console.log({ newExercise: newNutrition });
                  setOrUpdate({ ...data, nutritionId: newNutrition._id });
                  setShowSelect(false);
                },
              }
            )
          }
          createButtonContent={"new nutrition"}
          inputProps={{
            placeholder: "enter nuttition name...",
          }}
        />
      </Collapsible>
    </div>
  );
};

const Delete = () => {
  const { remove, mode } = useThisContext();

  return <DeleteButton onDelete={() => remove?.()} mode={mode} />;
};

export const NutritionEventFields = {
  Wrapper,
  Buttons,
  Event: EventField,
  Nutrition,
  Delete,
};
