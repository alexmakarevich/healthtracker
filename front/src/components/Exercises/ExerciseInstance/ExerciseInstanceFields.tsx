import React, {
  ButtonHTMLAttributes,
  HTMLProps,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { createUseStyles } from "react-jss";
import {
  EntityBaseContextUseQuery,
  useEntityBaseUseQuery,
} from "../../../hooks/useEntityBase";
import { createContextDefined } from "../../../context/ContextWrapper";
import { useExerciseInstanceContext } from "../../../context/ExerciseInstanceContextProvider";
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
import { eventDefaults } from "../../../logic/eventLogic";
import { EventFields } from "../../Events/EventFields";
import { Icon, IconSizes } from "../../generic/styling/Icon";
import { Button } from "../../generic/buttons/Button";

const useStyles = createUseStyles(
  {
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
  },

  { name: "ExerciseFields" }
);

export interface ExerciseInstanceFieldsProps {
  item: ExerciseInstanceDAO;
  initialMode: ItemModes;
  children: ReactNode;
}

const [
  useThisContext,
  Provider,
] = createContextDefined<ThisContextValue /** TODO: fix type any */>();

type ThisContextValue = ReturnType<typeof useExerciseInstance> & {
  // setOrUpdate: (input: ExerciseInstanceDAO) => void;
};

const Wrapper = ({
  item,
  initialMode,
  children,
}: // onCreate,
ExerciseInstanceFieldsProps) => {
  // const EVENTS = useEventContext();

  // const genericActions = useEntityBaseUseQuery(
  //   item,
  //   useExerciseInstanceContext(),
  //   initialMode,
  //   onCreate
  // );

  // const { handleCreate, complexState } = genericActions;

  // const contextProps = {
  //   ...genericActions,
  //   createWithNewEvent: () =>
  //     EVENTS.create(
  //       { ...eventDefaults },
  //       {
  //         onSuccess: (event) =>
  //           handleCreate({ ...complexState, eventId: event._id }),
  //         onError: (err) =>
  //           console.log(
  //             "Couldn't create event while creating exercise instance " + err
  //           ),
  //       }
  //     ),
  // };

  if (item._id === "60478060db4b530f68a1e777") console.log({ item });

  const EI = useExerciseInstance({
    data: item,
    initialMode,
  });

  if (item._id === "60478060db4b530f68a1e777") console.log({ EI });

  // const newContextProps: EntityBaseContextUseQuery<ExerciseInstanceDAO> = {};

  return <Provider value={EI}>{children}</Provider>;
};

const Buttons = () => {
  const {
    mode,
    create,
    data,
    reset,
    update,
    setMode,
    // createWithNewEvent,
  } = useThisContext();

  const events = useEventContext();
  const classes = useStyles();

  return (
    <CreateEditResetCancel
      mode={mode}
      // TODO: separate event creation from exercise instance creation
      onCreate={() =>
        create &&
        events.create(
          { ...eventDefaults },
          {
            onSuccess: (event) => {
              create(
                { ...data, eventId: event._id },
                { onSuccess: () => reset() }
              );
            },
          }
        )
      }
      onReset={reset}
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

  const { data, setOrUpdate, mode } = useThisContext();

  if (mode === ItemModes.Show && !data.repetitions) {
    return null;
  } else {
    return (
      <div>
        <input
          disabled={mode === ItemModes.Show}
          type={"number"}
          value={data.repetitions ?? 0}
          key={"check"}
          className={classConcat(classes.repsInput, className)}
          onChange={(e: React.ChangeEvent<any>) =>
            setOrUpdate({
              ...data,
              repetitions: parseInt(e.target.value),
            })
          }
        />
        {/* <div>reps</div> */}
      </div>
    );
  }
};

const Weight = ({ className, ...inputProps }: HTMLProps<HTMLDivElement>) => {
  const classes = useStyles();

  const { data, setOrUpdate, mode } = useThisContext();

  // if (mode === ItemModes.Show && !data.weightKg) {
  //   return null;
  // } else {
  return (
    <div>
      <input
        disabled={mode === ItemModes.Show}
        type={"number"}
        value={data.weightKg ?? 0}
        key={"check"}
        className={classConcat(classes.weightInput, className)}
        onChange={(e: React.ChangeEvent<any>) =>
          setOrUpdate({ ...data, weightKg: parseInt(e.target.value) })
        }
      />
      {/* <div>kg</div> */}
    </div>
  );
  // }
};

const Duration = ({ className, ...inputProps }: HTMLProps<HTMLDivElement>) => {
  const classes = useStyles();

  const { data, setOrUpdate, update, mode, reset } = useThisContext();

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
          setOrUpdate({
            ...data,
            durationSeconds: parseInt(e.target.value),
          });
        }}
      />
    );
  }
};

const Event = () => {
  const { data, event, setOrUpdate } = useThisContext();

  return event ? (
    <EventFields.Wrapper initialMode={ItemModes.QuickEdit} event={event}>
      <EventFields.DateTime />
    </EventFields.Wrapper>
  ) : null;
};

const Exercise = (divProps: HTMLProps<HTMLDivElement>) => {
  const { data, exercise, setOrUpdate, reset } = useThisContext();
  const { className, ...otherDivProps } = divProps;

  const exCtx = useExerciseContext();
  const classes = useStyles();

  const [showSelect, setShowSelect] = useState(
    data.exerciseId === exerciseInstanceDefaults.exerciseId
  );

  const exerciseId = data.exerciseId;

  const areNoneSelected = useMemo(() => !exercise, [exerciseId]);

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
            console.log("onSelect", id);
            setOrUpdate({ ...data, exerciseId: id });
            setShowSelect(false);
          }}
          onCreateNew={(title) =>
            exCtx.create({ ...exerciseTypeDefaults, title: title })
          }
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
