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
import {
  ExerciseInstanceDAO,
  exerciseInstanceDefaults,
  useExerciseInstance,
} from "../../../logic/exerciseInstanceLogic";
import { exerciseTypeDefaults } from "../../../logic/exerciseTypeLogic";
import { classConcat, ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";
import PickOrAdd from "../../generic/PickOrAdd";
import { Box } from "../../generic/styling/Box";
import { useEventContext } from "../../../context/EventContextProvider";
import { EventDAO, eventDefaults } from "../../../logic/eventLogic";
import { EventFields } from "../../Events/EventFields";
import { Icon, IconSizes } from "../../generic/styling/Icon";
import { Button } from "../../generic/buttons/Button";
import { Theme } from "../../../styling/theme";

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
  item: ExerciseInstanceDAO;
  initialMode: ItemModes;
  children: ReactNode;
  newEvent?: EventDAO;
}

const [useThisContext, Provider] = createContextDefined<ThisContextValue>();

type ThisContextValue = ReturnType<typeof useExerciseInstance> & {
  newEvent?: EventDAO;
  setNewEvent: React.Dispatch<React.SetStateAction<EventDAO>>;
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

  const [newEvent, setNewEvent] = useState({ ...eventDefaults });

  return (
    <Provider value={{ ...EI, newEvent, setNewEvent }}>{children}</Provider>
  );
};

const Buttons = () => {
  const {
    mode,
    create,
    data,
    reset,
    newEvent,
    setNewEvent,
    update,
    setMode,
  } = useThisContext();

  const events = useEventContext();
  const classes = useStyles();

  return (
    <CreateEditResetCancel
      mode={mode}
      onCreate={() =>
        create &&
        events.create(newEvent, {
          onSuccess: (event) => {
            create(
              { ...data, eventId: event._id },
              {
                onSuccess: () => {
                  reset();
                  setNewEvent({
                    ...eventDefaults,
                    time: new Date().toISOString(),
                  });
                },
                // cleaning up auto-created event, if exercise instance creation fails
                onError: () => {
                  events.delete(event);
                },
              }
            );
          },
        })
      }
      onReset={() => {
        reset();
        setNewEvent({
          ...eventDefaults,
          time: new Date().toISOString(),
        });
      }}
      onSave={update}
      onCancelEdit={() => setMode(ItemModes.Show)}
      onSetMode={setMode}
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

const Event = (inputProps: HTMLProps<HTMLInputElement>) => {
  const { event, newEvent, mode, setNewEvent } = useThisContext();

  return (
    <EventFields.Wrapper
      initialMode={mode}
      event={event ?? newEvent ?? eventDefaults}
      onChange={(event) => mode === ItemModes.New && setNewEvent(event)}
    >
      <EventFields.DateTime {...inputProps} />
    </EventFields.Wrapper>
  );
};

const Exercise = (divProps: HTMLProps<HTMLDivElement>) => {
  const { data, exercise, setOrUpdate } = useThisContext();
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
        {/* TODO: check why the drowpdwon is selected the whole time - likely has to do with the exercise query not being ready */}
        {data.exerciseId !== exerciseInstanceDefaults.exerciseId && (
          <Button
            onClick={() => setShowSelect(!showSelect)}
            className={classes.exerciseButton}
          >
            <Icon icon={showSelect ? "undo" : "pen"} size={IconSizes.S} />
          </Button>
        )}
      </div>
      {(areNoneSelected || showSelect) && (
        <PickOrAdd
          dropdownItems={dropdownItems}
          onSelect={(id: string) => {
            setOrUpdate({ ...data, exerciseId: id });
            setShowSelect(false);
          }}
          onCreateNew={(title) =>
            exCtx.create({ ...exerciseTypeDefaults, title: title })
          }
          createButtonContent={"new exercise"}
          inputProps={{
            placeholder: "enter exercise name...",
          }}
        />
      )}
    </div>
  );
};

const Delete = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { delete: del, mode } = useThisContext();

  return <DeleteButton onDelete={() => del?.()} mode={mode} {...props} />;
};

const ExerciseInstanceFields = {
  Wrapper,
  Event,
  Buttons,
  Exercise,
  Repetitions,
  Weight,
  Duration,
  Delete,
};

export { ExerciseInstanceFields };
