import React from "react";
import { EventContext } from "../../context/EventContextProvider";
import { ExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { ExerciseTypeContext } from "../../context/ExerciseTypeContextProvider";
import { ChartParts } from "./ChartParts";
import { Scales } from "./LineAndDotChart";

// TODO: import types from LineAndDotChart

interface ChartData {
  x: Date;
  y: number;
  label?: string | number;
  radius?: number;
}

export const ExerciseVisualization = () => {
  const events = EventContext.use();
  const exerciseInstances = ExerciseInstanceContext.use();
  const exercises = ExerciseTypeContext.use();

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
      <ChartParts
        xScale={Scales.Time}
        yScale={Scales.Linear}
        series={chartData}
        minY={0}
      />
    </>
  );
};
