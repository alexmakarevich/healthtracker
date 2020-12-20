import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export enum Scales {
  Linear = "Linear",
  Time = "Time",
}

interface Data<xType extends Scales, yType extends Scales> {
  x: xType extends Scales.Linear
    ? number
    : xType extends Scales.Time
    ? Date
    : number;
  y: yType extends Scales.Linear
    ? number
    : yType extends Scales.Time
    ? Date
    : number;
  radius: number;
}

interface LineAndDotChartProps<xType extends Scales, yType extends Scales> {
  xAxis: xType;
  yAxis: yType;
  data: Data<xType, yType>[];
}

export const LineAndDotChart = <xType extends Scales, yType extends Scales>({
  data,
  xAxis,
  yAxis,
}: LineAndDotChartProps<xType, yType>) => {
  type DefinedData = Data<xType, yType>;

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 40, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  const ref = useRef(null);

  const axis = (which: "x" | "y") => (dataType: Scales) => {
    const range = which === "x" ? [0, width] : [height, 0];

    const axis =
      dataType === Scales.Time
        ? d3
            .scaleTime()
            .domain([new Date("2020-12-01"), new Date("2020-12-20")])
            .range(range)
        : d3.scaleLinear().domain([0, 100]).range(range);

    return axis;
  };

  const x = axis("x")(xAxis);
  const y = axis("y")(yAxis);

  useEffect(() => {
    const svg = d3.select(ref.current);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(axis("x")(xAxis)));

    svg.append("g").call(d3.axisLeft(y));
  }, []);

  useEffect(() => {
    // get svg base
    const svg = d3.select(ref.current);

    // add/update line
    svg
      .selectAll("path.line")
      .data([data])
      .join("path")
      .transition()
      .duration(150)
      .attr(
        "d",
        d3
          .line<DefinedData>()
          .x((d) => x(d.x))
          .y((d) => y(d.y))
          .curve(d3.curveCardinal)
      )
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);

    // add/update dots
    const circles = svg
      .selectAll<SVGCircleElement, DefinedData>("circle")
      .data(data);

    circles
      .enter()
      .append("circle")
      .merge(circles)
      .transition()
      .duration(150)
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", (d) => d.radius)
      .style("fill", "lime")
      .style("stroke", "black")
      .style("stroke-width", 10);

    circles.exit().remove();
  }, [data]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`}></g>
    </svg>
  );
};
