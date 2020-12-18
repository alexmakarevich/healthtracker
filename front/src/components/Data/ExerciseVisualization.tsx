import React, { useContext, useEffect } from "react";
import * as d3 from "d3";
import { useEventContext } from "../../context/EventContextProvider";
import { TimeLocaleObject } from "d3";
import { useExerciseInstanceContext } from "../../context/ExerciseInstanceContextProvider";
import { useExerciseContext } from "../../context/ExerciseTypeContextProvider";

interface ChartData {
  x: Date;
  y: number;
  radius?: number;
}

export const ExerciseVisualization = () => {
  const events = useEventContext();
  const exerciseInstances = useExerciseInstanceContext();
  const exercises = useExerciseContext();

  const dummyChartData = [
    { x: new Date("2020-12-02"), y: 20, radius: 3 },
    { x: new Date(), y: 90, radius: 15 },
    { x: new Date("2020-12-11"), y: 50, radius: 7 },
    { x: new Date("2020-12-18"), y: 35, radius: 7 },
  ];

  let chartData: ChartData[] = dummyChartData;

  if (!!events.all && !!exerciseInstances.all && !!exercises.all) {
    const allEvents = events.all;

    console.log({ allEvents });

    const realChartData = exerciseInstances.all
      .map((ei) => {
        const thisEvent = allEvents.find((e) =>
          e.children.exerciseInstanceIds.find((id) => id === ei._id)
        );
        if (thisEvent) {
          return {
            y: ei.repetitions ?? 0,
            x: new Date(thisEvent.time),
          };
        } else {
          return undefined;
        }
      })
      // odd TS behavior with Array.filter
      .filter((d): d is ChartData => d !== undefined);

    chartData = realChartData;
  }

  console.log({ chartData });

  /** Chart Settings */
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 40, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // Create data
  const data = [
    { x: 10, y: 20, radius: 3 },
    { x: 45, y: 90, radius: 15 },
    { x: 80, y: 50, radius: 7 },
  ];

  const data1 = [
    { x: 60, y: 20, radius: 10 },
    { x: 55, y: 60, radius: 11 },
    { x: 83, y: 54, radius: 9 },
  ];

  const data2 = [
    { x: 10, y: 20, radius: 3 },
    { x: 25, y: 30, radius: 5 },
    { x: 50, y: 58, radius: 17 },
  ];

  const dataArray = [data1, data2];

  useEffect(() => {
    // append the svg object to the body of the page
    const svg = d3.select("#scatter_area");

    // X scale and Axis
    var x = d3
      .scaleTime()
      .domain([new Date("2020-11-01"), new Date("2020-12-20")])
      // This is the min and the max of the data: 0 to 100 if percentages
      .range([0, width]); /// This is the corresponding value I want in Pixel
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Y scale and Axis
    var y = d3
      .scaleLinear()
      .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([height, 0]); // This is the corresponding value I want in Pixel
    svg.append("g").call(d3.axisLeft(y));

    // Add the line
    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line<ChartData>()
          .x((d) => x(d.x.getDate()))
          .y((d) => y(d.y))
      );

    // // Add dots
    // svg
    //   .selectAll("whatever")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", (d) => x(d.x))
    //   .attr("cy", (d) => y(d.y))
    //   .attr("r", (d) => x(d.radius))
    //   .style("fill", "lime")
    //   .style("stroke", "black")
    //   .style("stroke-width", 10);

    /** Chart Settings */
  }, []);

  // create initial chart base
  useEffect(() => {
    const svg = d3
      .select("#scatter_area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }, []);

  return <div id="scatter_area" />;
};
