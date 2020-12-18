import React, { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";

export const SampleVisualizationTime = () => {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 40, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const now = new Date();

  interface Data {
    x: Date;
    y: number;
    radius: number;
  }

  // Create data
  const data: Data[] = [
    { x: new Date("2020-12-02"), y: 20, radius: 3 },
    { x: now, y: 90, radius: 15 },
    { x: new Date("2020-12-11"), y: 50, radius: 7 },
    { x: new Date("2020-12-18"), y: 35, radius: 7 },
  ];

  const ref = useRef(null);

  useEffect(() => {
    // append the svg object to the body of the page
    const svg = d3.select(ref.current);

    // .select("#scatter_area")
    // .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X scale and Axis
    const x = d3
      .scaleTime()
      .domain([new Date("2020-12-01"), new Date("2020-12-20")]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([0, width]); // This is the corresponding value I want in Pixel
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Y scale and Axis
    const y = d3
      .scaleLinear()
      .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([height, 0]); // This is the corresponding value I want in Pixel
    svg.append("g").call(d3.axisLeft(y));

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line<Data>()
          .x((d) => x(d.x))
          .y((d) => y(d.y))
      );

    // Add dots
    svg
      .selectAll("whatever")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", (d) => x(d.radius))
      .style("fill", "lime")
      .style("stroke", "black")
      .style("stroke-width", 10);
  }, []);

  return (
    //  <div id="scatter_area" />

    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`} />
    </svg>
  );
};
