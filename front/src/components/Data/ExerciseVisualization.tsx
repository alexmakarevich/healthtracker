import React, { useContext, useEffect } from "react";
import * as d3 from "d3";
import { useEventContext } from "../../context/EventContextProvider";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";
import { LineAndDotChart, Scales } from "./LineAndDotChart";

interface ChartData {
  x: Date;
  y: number;
  label?: string | number;
  radius?: number;
}

export const ExerciseVisualization = () => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();
  const exercises = useExerciseContext();

  if (!events.all || !exerciseInstances.all || !exercises.all) {
    return null;
  }
  const dummyChartData = [
    { x: new Date("2020-12-02"), y: 20, radius: 3 },
    { x: new Date(), y: 90, radius: 15 },
    { x: new Date("2020-12-11"), y: 50, radius: 7 },
    { x: new Date("2020-12-18"), y: 35, radius: 7 },
  ];

  let chartData: ChartData[][] = [dummyChartData];

  if (!!events.all && !!exerciseInstances.all && !!exercises.all) {
    const allEvents = events.all;

    let groupedChartData: Record<string, ChartData[]> = {};

    exerciseInstances.all.forEach((ei) => {
      const thisEvent = allEvents.find((e) =>
        e.children.exerciseInstanceIds.find((id) => id === ei._id)
      );
      if (thisEvent) {
        if (!groupedChartData[ei.exerciseId]) {
          groupedChartData[ei.exerciseId] = [];
        }
        groupedChartData[ei.exerciseId].push({
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
      <h1>ExerciseVisualization</h1>
      <LineAndDotChart
        xScale={Scales.Time}
        yScale={Scales.Linear}
        data={chartData}
      />
    </>
  );
};
