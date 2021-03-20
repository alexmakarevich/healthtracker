import React, { HTMLProps, ReactNode, useContext, useState } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults, eventLogic } from "../../logic/eventLogic";
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
  event: Event;
  initialMode: ItemModes;
  children: ReactNode;
}

const [useThisContext, Provider] = createContextDefined<
  EntityBaseContextUseQuery<Event>
>();

const Wrapper = ({ event, initialMode, children }: EventFieldProps) => {
  const contextProps = useEntityBaseUseQuery(
    event,
    useEventContext(),
    initialMode
  );

  return <Provider value={contextProps}>{children}</Provider>;
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

const DateTime = (inputProps: HTMLProps<HTMLInputElement>) => {
  const { handleSetOrUpdate, complexState: event } = useThisContext();

  const time = new Date(event.time);

  function changeDateTime(newDateTime: Date) {
    handleSetOrUpdate({ time: newDateTime.toISOString() });
  }

  return <InputDateTime date={time} onChange={changeDateTime} />;
};

const NutritionItems = () => {
  const classes = useStyles();
  const [showAddNIinput, setShowAddNIinput] = useState(false);
  const nutritionContext = useNutritionItemContext();

  const {
    handleSetOrUpdate,
    complexState: event,
    mode,
    handleCreate,
  } = useThisContext();
  const { addNI, removeNI } = eventLogic(event);

  return (
    <div className={classes.itemsWrapper}>
      {event.children.nutritionItemIds.map((niId) => {
        const ni = nutritionContext.getOneFromContext(niId);
        return (
          ni && (
            <Removable
              onRemove={() => handleSetOrUpdate(removeNI(ni._id))}
              key={ni._id}
            >
              <NutritionFields.Wrapper item={ni} initialMode={ItemModes.Show}>
                <Box>
                  <NutritionFields.Title />
                </Box>
              </NutritionFields.Wrapper>
            </Removable>
          )
        );
      })}
      <Collapsible
        isExpanded={!showAddNIinput}
        animation={Animations.ExpandWidth}
      >
        <button onClick={() => setShowAddNIinput(!showAddNIinput)}>
          + nutrition
        </button>
      </Collapsible>
      <Collapsible
        isExpanded={showAddNIinput}
        animation={Animations.ExpandWidth}
      >
        <div className={classes.itemsWrapper}>
          <AddNutritionItem
            onAdd={(id) => {
              const newItem = addNI(id);
              if (mode === ItemModes.New) {
                handleCreate(newItem);
              } else {
                handleSetOrUpdate(newItem);
                setShowAddNIinput(false);
              }
            }}
            idsToExclude={event.children.nutritionItemIds}
          />
          {event.children.exerciseInstanceIds.length === 0 && (
            <button
              className={classes.removeButton}
              onClick={() => setShowAddNIinput(!showAddNIinput)}
            >
              X
            </button>
          )}
        </div>
      </Collapsible>
    </div>
  );
};

const ExerciseItems = () => {
  const classes = useStyles();
  const [showAddExerciseInstance, setShowAddExerciseInstance] = useState(false);
  const exerciseInstances = useExerciseInstanceContext();

  const excerciseInstanceContext = useExerciseInstanceContext();

  const {
    handleSetOrUpdate,
    complexState: event,
    handleCreate,
    mode,
  } = useThisContext();
  const { addExercise, removeExercise } = eventLogic(event);

  const eiIds = event.children.exerciseInstanceIds;

  return (
    <div className={classes.itemsWrapper}>
      <FlexRow childClassName={classes.item}>
        {eiIds.map((id) => {
          const ei = exerciseInstances.getOneFromContext(id);

          return (
            ei && (
              <Removable
                onRemove={() => {
                  handleSetOrUpdate(removeExercise(id));
                  excerciseInstanceContext.delete(ei);
                }}
                key={id}
              >
                <ExerciseInstanceFields.Wrapper
                  item={ei}
                  initialMode={ItemModes.QuickEdit}
                >
                  <Box className={classes.exerciseBox}>
                    <FlexRow childClassName={classes.item}>
                      <ExerciseInstanceFields.Exercise />
                      <ExerciseInstanceFields.Repetitions />
                      <ExerciseInstanceFields.Weight />
                      <ExerciseInstanceFields.Duration />
                    </FlexRow>
                  </Box>
                </ExerciseInstanceFields.Wrapper>
              </Removable>
            )
          );
        })}
      </FlexRow>
      <Collapsible
        isExpanded={!showAddExerciseInstance}
        animation={Animations.ExpandWidth}
      >
        {event.children.nutritionItemIds.length === 0 && (
          <button
            onClick={() => setShowAddExerciseInstance(!showAddExerciseInstance)}
          >
            + exercise
          </button>
        )}
      </Collapsible>
      <Collapsible
        isExpanded={showAddExerciseInstance}
        animation={Animations.ExpandWidth}
      >
        <div className={classes.itemsWrapper}>
          <ExerciseInstanceFields.Wrapper
            item={exerciseInstanceDefaults}
            initialMode={ItemModes.New}
            // onCreate={(item) => {
            //   console.log("onCreate", item);
            //   if (mode === ItemModes.New) {
            //     handleCreate(addExercise(item._id));
            //     setShowAddExerciseInstance(false);
            //   } else {
            //     handleSetOrUpdate(addExercise(item._id));
            //   }
            // }}
          >
            <FlexRow childClassName={classes.item}>
              <ExerciseInstanceFields.Buttons />
              <ExerciseInstanceFields.Exercise />
              <ExerciseInstanceFields.Repetitions />
              <ExerciseInstanceFields.Weight />
              <ExerciseInstanceFields.Duration />
              <ExerciseInstanceFields.Delete />
            </FlexRow>
          </ExerciseInstanceFields.Wrapper>
          <button
            className={classes.removeButton}
            onClick={() => setShowAddExerciseInstance(!showAddExerciseInstance)}
          >
            X
          </button>
        </div>
      </Collapsible>
    </div>
  );
};

const Delete = () => {
  const { handleDelete, mode } = useThisContext();

  return <DeleteButton onDelete={handleDelete} mode={mode} />;
};

const EventFields = {
  Wrapper,
  Buttons,
  DateTime,
  NutritionItems,
  ExerciseItems,
  Delete,
};

export { EventFields };
