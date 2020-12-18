import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Data {
  x: number;
  y: number;
  radius: number;
}

interface LineAndDotChartProps {
  data: Data[];
}

export const LineAndDotChart = ({ data }: LineAndDotChartProps) => {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 40, bottom: 30, left: 30 },
    width = 350 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

  const ref = useRef(null);

  // axis functions
  const x = d3
    .scaleLinear()
    .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, width]); // This is the corresponding value I want in Pixel

  const y = d3
    .scaleLinear()
    .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
    .range([height, 0]); // This is the corresponding value I want in Pixel

  useEffect(() => {
    const svg = d3.select(ref.current);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));
  }, []);

  useEffect(() => {
    const svg = d3.select(ref.current);

    const lineGroup = svg.select("g .line").datum(data);
    lineGroup.remove();
    svg
      .append("g")
      .attr("class", "line")
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

    svg.selectAll("circle").data(data).remove();
    svg
      .selectAll("circle")
      .remove()
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", (d) => x(d.radius))
      .style("fill", "lime")
      .style("stroke", "black")
      .style("stroke-width", 10);
  }, [data]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`} />
    </svg>
  );
};
