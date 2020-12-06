import React, { useContext, useEffect } from "react";
import * as d3 from "d3";

export const SampleVisualization = () => {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 40, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  interface Data {
    x: number;
    y: number;
    radius: number;
  }

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
    const svg = d3
      .select("#scatter_area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X scale and Axis
    var x = d3
      .scaleLinear()
      .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([0, width]); // This is the corresponding value I want in Pixel
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

    // Add dots for each dataset

    dataArray.forEach((data) => {
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
    });
  });

  return <div id="scatter_area" />;
};
