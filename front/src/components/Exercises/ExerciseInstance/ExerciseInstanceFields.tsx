import React, {
  ButtonHTMLAttributes,
  HTMLProps,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { createUseStyles } from "react-jss";
import { createContextDefined } from "../../../context/ContextWrapper";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import { useExerciseInstance } from "../../../logic/exerciseInstanceLogic";
import { classConcat, ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";
import PickOrAdd from "../../generic/PickOrAdd";
import { Box } from "../../generic/styling/Box";
import { Event } from "../../../logic/eventLogic";
import { EventFields } from "../../Events/EventFields";
import { Icon, IconSizes } from "../../generic/styling/Icon";
import { Button } from "../../generic/buttons/Button";
import { Theme } from "../../../styling/theme";
import Collapsible, { Animations } from "../../generic/Collapsible";
import {
  ExerciseInstanceData,
  eventDefaults,
  exerciseInstanceDefaults,
  exerciseTypeDefaults,
  EventData,
} from "shared";

console.log({ exerciseInstanceDefaults, exerciseTypeDefaults });

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
    exerciseWrapper: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    exerciseButton: {
      marginLeft: "0.5em",
    },
    newExerciseButton: {
      position: "absolute",
      left: "100%",
      top: 0,
      background: theme.good,
      zIndex: 50,
    },
  }),

  { name: "ExerciseFields" }
);

export interface ExerciseInstanceFieldsProps {
  item: ExerciseInstanceData;
  initialMode: ItemModes;
  children: ReactNode;
  newEvent?: EventData;
}

const [useThisContext, Provider] = createContextDefined<ThisContextValue>();

type ThisContextValue = ReturnType<typeof useExerciseInstance> & {
  event: Event;
};

const Wrapper = ({
  item,
  initialMode,
  children,
}: ExerciseInstanceFieldsProps) => {
  const EI = useExerciseInstance({
    data: item,
    initialMode,
  });

  const { eventData } = EI;

  const { ProviderWrapper, event } = EventFields.WrapperAndHook({
    event: eventData ?? eventDefaults,
    initialMode: eventData ? ItemModes.QuickEdit : ItemModes.New,
    children,
  });

  return <Provider value={{ ...EI, event }}>{ProviderWrapper}</Provider>;
};

const Buttons = () => {
  const classes = useStyles();

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
      className={classes.buttons}
    />
  );
};

const Repetitions = ({
  className,
  ...inputProps
}: HTMLProps<HTMLDivElement>) => {
  const classes = useStyles();

  const { data, setOrUpdateDebounced, mode } = useThisContext();

  if (mode === ItemModes.Show && !data.repetitions) {
    return null;
  } else {
    return (
      <input
        disabled={mode === ItemModes.Show}
        type={"number"}
        value={data.repetitions ?? 0}
        key={"check"}
        className={classConcat(classes.repsInput, className)}
        onChange={(e: React.ChangeEvent<any>) =>
          setOrUpdateDebounced({
            ...data,
            repetitions: parseInt(e.target.value),
          })
        }
      />
    );
  }
};

const Weight = ({ className, ...inputProps }: HTMLProps<HTMLDivElement>) => {
  const classes = useStyles();

  const { data, setOrUpdateDebounced, mode } = useThisContext();

  return (
    <input
      disabled={mode === ItemModes.Show}
      type={"number"}
      value={data.weightKg ?? 0}
      key={"check"}
      className={classConcat(classes.weightInput, className)}
      onChange={(e: React.ChangeEvent<any>) =>
        setOrUpdateDebounced({ ...data, weightKg: parseInt(e.target.value) })
      }
    />
  );
  // }
};

const Duration = ({ className, ...inputProps }: HTMLProps<HTMLDivElement>) => {
  const classes = useStyles();

  const { data, setOrUpdateDebounced, mode } = useThisContext();

  if (mode === ItemModes.Show && !data.durationSeconds) {
    return null;
  } else {
    return (
      <input
        disabled={mode === ItemModes.Show}
        type={"number"}
        value={data.durationSeconds ?? 0}
        key={"check"}
        className={classConcat(classes.durationInput, className)}
        onChange={async (e: React.ChangeEvent<any>) => {
          // setOrUpdate({ ...data, durationSeconds: parseInt(e.target.value) })
          setOrUpdateDebounced({
            ...data,
            durationSeconds: parseInt(e.target.value),
          });
        }}
      />
    );
  }
};

const EventField = (inputProps: HTMLProps<HTMLInputElement>) => {
  return <EventFields.DateTime />;
};

const Exercise = (divProps: HTMLProps<HTMLDivElement>) => {
  const { data, exerciseData: exercise, setOrUpdate } = useThisContext();
  const { className, ...otherDivProps } = divProps;

  const exCtx = useExerciseContext();
  const classes = useStyles();

  const [showSelect, setShowSelect] = useState(
    data.exerciseId === exerciseInstanceDefaults.exerciseId
  );

  const areNoneSelected = useMemo(() => !exercise, [exercise]);

  const dropdownItems = exCtx.all?.map((exercise) => ({
    id: exercise._id,
    isSelected: false,
    searchableText: exercise.title,
    node: <Box>{exercise.title}</Box>,
  }));

  return (
    <div className={className} {...otherDivProps}>
      <div className={classes.exerciseWrapper}>
        <span> {exercise?.title}</span>
        {data.exerciseId !== exerciseInstanceDefaults.exerciseId && (
          <Button
            onClick={() => setShowSelect(!showSelect)}
            className={classes.exerciseButton}
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
            setOrUpdate({ ...data, exerciseId: id });
            setShowSelect(false);
          }}
          onCreateNew={(title) =>
            exCtx.create(
              { ...exerciseTypeDefaults, title: title },
              {
                onSuccess: (newExercise) => {
                  console.log({ newExercise });
                  setOrUpdate({ ...data, exerciseId: newExercise._id });
                  setShowSelect(false);
                },
              }
            )
          }
          createButtonContent={"new exercise"}
          inputProps={{
            placeholder: "enter exercise name...",
          }}
        />
      </Collapsible>
    </div>
  );
};

const Delete = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { delete: del, mode } = useThisContext();

  return <DeleteButton onDelete={() => del?.()} mode={mode} {...props} />;
};

const ExerciseInstanceFields = {
  Wrapper,
  Event: EventField,
  Buttons,
  Exercise,
  Repetitions,
  Weight,
  Duration,
  Delete,
};

export { ExerciseInstanceFields };
