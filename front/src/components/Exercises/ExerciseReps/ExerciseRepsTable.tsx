import React, { createContext, useContext } from "react";
import { createUseStyles } from "react-jss";
import { useEntityBase } from "../../../common/useEntityBase";
import { useRepsContext } from "../../../context/ExerciseRepsContextProvider";
import { useExerciseContext } from "../../../context/ExerciseTypeContextProvider";
import { exerciseRepsDefaults } from "../../../logic/exerciseRepsLogic";
import { exerciseTypeDefaults } from "../../../logic/exerciseTypeLogic";
import { ItemModes } from "../../../utils/utils";
import { CreateEditResetCancel } from "../../EntityElements/CreateEditResetCancel";
import { DeleteButton } from "../../EntityElements/Delete";
import { SimpleRow } from "../../generic/layout/SimpleRow";
import PickOrAdd, { SearchableSelectChild } from "../../generic/PickOrAdd";
import Removable from "../../generic/Removable";
import SearchWithDropdown from "../../generic/SearchWithDropdown";
import { Box } from "../../generic/styling/Box";
import { ExerciseRepsRowNew } from "./ExcerciseRepsRowNew";
import { ExerciseRepsRow } from "./ExerciseRepsRow";
import {
  ExerciseRepsFieldProps,
  useExerciseRepsFields,
} from "./useExerciseRepsFilelds";
// import {useState} from 'react';

const styles = () => ({
  list: {
    background: "#f0f0f0",
    padding: "5px",
    borderRadius: "15px",
  },
});

const useStyles = createUseStyles(styles, { name: "ExerciseReps" });

const ExerciseRepsTable = () => {
  const exerciseReps = useRepsContext();

  const classes = useStyles();

  return (
    <>
      <h2>Exercise Reps Table</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={classes.list}>
          {exerciseReps.all.map((exercise, index) => (
            <Row
              key={index}
              item={exercise}
              initialMode={ItemModes.QuickEdit}
            />
          ))}
          <Row
            key={"new"}
            item={exerciseRepsDefaults}
            initialMode={ItemModes.New}
          />
        </tbody>
      </table>
    </>
  );
};

const Row = (props: ExerciseRepsFieldProps) => {
  const {
    complexState: reps,
    setComplexState: setReps,
    handleSetOrUpdate,
    mode,
    setMode,
    handleCreate,
    handleCancel,
    handleDelete,
    handleSave,
    handleUpdate,
    reset,
  } = useEntityBase(props.item, useRepsContext(), props.initialMode);

  const exerciseContext = useExerciseContext();

  const dropdownItems: SearchableSelectChild[] = exerciseContext.all.map(
    (exercise) => ({
      id: exercise._id,
      isSelected: false,
      searchableText: exercise.title,
      node: <Box>{exercise.title}</Box>,
    })
  );

  const noExercise = exerciseRepsDefaults.exerciseId;
  const hasExercise = reps.exerciseId !== noExercise;

  const ex = exerciseContext.getOneFromContext(reps.exerciseId);

  console.log("render");

  const exercise = () => {
    console.log(hasExercise, ex?.title, !!ex?.title);

    return hasExercise
      ? ex?.title
        ? ex?.title
        : "exercise not found"
      : "none";
  };

  return (
    <SimpleRow>
      <CreateEditResetCancel
        mode={mode}
        onSetMode={setMode}
        onCancel={handleCancel}
        onCreate={handleCreate}
        onReset={reset}
        onSave={handleSave}
        valid={reps.exerciseId !== exerciseRepsDefaults.exerciseId}
      />
      <div>{reps._id}</div>
      <div>{reps.exerciseId}</div>
      <div>
        <Removable
          onRemove={() =>
            handleSetOrUpdate({ exerciseId: exerciseRepsDefaults.exerciseId })
          }
        >
          {exercise()}
        </Removable>
        {reps.exerciseId === exerciseRepsDefaults.exerciseId && (
          <PickOrAdd
            dropdownItems={dropdownItems}
            onSelect={(id: string) => setReps({ exerciseId: id })}
            onCreateNew={(title) =>
              exerciseContext.create({ ...exerciseTypeDefaults, title: title })
            }
          />
        )}
      </div>
      <input
        value={reps.repetitions}
        type={"number"}
        onChange={(e) =>
          handleSetOrUpdate({ repetitions: parseInt(e.target.value) })
        }
      />
      <DeleteButton mode={mode} onDelete={handleDelete} />
    </SimpleRow>
  );
};

export { ExerciseRepsTable };
