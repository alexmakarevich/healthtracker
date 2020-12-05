import React, { useContext, useEffect } from "react";
import * as d3 from "d3";

export const SampleVisualization = () => {
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

  useEffect(() => {
    // append the svg object to the body of the page
    const svG = d3
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
    svG
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // X scale and Axis
    var y = d3
      .scaleLinear()
      .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([height, 0]); // This is the corresponding value I want in Pixel
    svG.append("g").call(d3.axisLeft(y));

    // Add 3 dots for 0, 50 and 100%
    svG
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

  return <div id="scatter_area" />;
};
