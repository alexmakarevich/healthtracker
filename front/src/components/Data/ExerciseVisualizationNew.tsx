import React from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { LineAndDotChart, Scales } from "./LineAndDotChart";

// TODO: import types from LineAndDotChart

interface ChartData {
  x: Date;
  y: number;
  label?: string | number;
  radius?: number;
}

export const ExerciseVisualizationNew = () => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();
  const exercises = useExerciseContext();

  if (!events.all || !exerciseInstances.all || !exercises.all) {
    return null;
  }
  let chartData: { data: ChartData[] }[] = [];

  if (!!events.all && !!exerciseInstances.all && !!exercises.all) {
    let groupedChartData: Record<
      string,
      { data: ChartData[]; legend?: string }
    > = {};

    exerciseInstances.all.forEach((ei) => {
      const thisEvent = events.getOneFromContext(ei.eventId);
      if (thisEvent) {
        if (!groupedChartData[ei.exerciseId]) {
          groupedChartData[ei.exerciseId] = {
            data: [],
            legend: exercises.getOneFromContext(ei.exerciseId)?.title,
          };
        }
        groupedChartData[ei.exerciseId].data.push({
          y: ei.repetitions ?? 0,
          x: new Date(thisEvent.time),
          radius: ei.weightKg,
          label: `${ei.repetitions ?? 0} - ${ei.weightKg ?? 0}kg`,
        });
      }
    });

    chartData = Object.values(groupedChartData);
  }

  return (
    <>
      <LineAndDotChart
        xScale={Scales.Time}
        yScale={Scales.Linear}
        series={chartData}
      />
    </>
  );
};
