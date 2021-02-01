import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { axisBottom } from "d3";

export enum Scales {
  Linear = "Linear",
  Time = "Time",
}

interface Data<xType extends Scales, yType extends Scales> {
  x: xType extends Scales.Time ? Date : number;
  y: yType extends Scales.Time ? Date : number;
  radius?: number;
}

interface LineAndDotChartProps<XScale extends Scales, YScale extends Scales> {
  xScale: XScale;
  yScale: YScale;
  data: Data<XScale, YScale>[][];
  sortX?: boolean;
  minX?: Data<XScale, YScale>["x"];
  maxX?: Data<XScale, YScale>["x"];
  minY?: Data<XScale, YScale>["y"];
  maxY?: Data<XScale, YScale>["y"];
}

export const LineAndDotChart = <xType extends Scales, yType extends Scales>({
  data,
  xScale,
  yScale,
  sortX = xScale === Scales.Time,
  minX: minXForce,
  maxX: maxXForce,
  minY: minYForce,
  maxY: maxYForce,
}: LineAndDotChartProps<xType, yType>) => {
  type DefinedData = Data<xType, yType>;

  const sortByX = (data: DefinedData[]) =>
    data.slice().sort((a, b) => (a.x < b.x ? -1 : 0));
  const sortByY = (data: DefinedData[]) =>
    data.slice().sort((a, b) => (a.y < b.y ? -1 : 0));

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  const dataSortedByX = data.map((datum) => sortByX(datum));
  const dataSortedByY = data.map((datum) => sortByY(datum));

  const dataFlat = data.flat();

  const minX = minXForce ?? sortByX(dataFlat)[0].x;
  const maxX = maxXForce ?? sortByX(dataFlat)[dataFlat.length - 1].x;
  const minY = minYForce ?? sortByY(dataFlat)[0].y;
  const maxY = maxYForce ?? sortByY(dataFlat)[dataFlat.length - 1].y;

  console.log({
    dataSortedByX,
    dataSortedByY,
    minX,
    maxX,
    minY,
    maxY,
  });

  const adjustedData = sortX ? dataSortedByX : data;

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 40, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  const ref = useRef(null);

  const axis = (which: "x" | "y") => (dataType: Scales) => {
    const range = which === "x" ? [0, width] : [height, 0];
    const domain = which === "x" ? [minX, maxX] : [minY, maxY];

    const axis =
      dataType === Scales.Time
        ? d3.scaleTime().domain(domain).range(range)
        : d3.scaleLinear().domain(domain).range(range);

    return axis;
  };

  const x = axis("x")(xScale);
  const y = axis("y")(yScale);

  useEffect(() => {
    // get svg base
    const svg = d3.select(ref.current);

    // add/update axes
    svg
      .select<SVGGElement>(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x));

    svg.select<SVGGElement>(".y-axis").call(d3.axisLeft(y));

    adjustedData.forEach((datum, index) => {
      // add/update line
      svg
        .selectAll("path.line-" + index)
        .data([datum])
        .join("path")
        .transition()
        .duration(150)
        .attr(
          "d",
          d3
            .line<DefinedData>()
            .x((d) => x(d.x))
            .y((d) => y(d.y))
            .curve(d3.curveLinear)
        )
        .attr("class", "line-" + index)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

      // add/update dots
      const circles = svg
        .selectAll<SVGCircleElement, DefinedData>("circle.series-" + index)
        .data(datum);

      circles
        .enter()
        .append("circle")
        .merge(circles)
        .transition()
        .duration(150)
        .attr("class", "series-" + index)
        .attr("cx", (d) => x(d.x))
        .attr("cy", (d) => y(d.y))
        .attr("r", (d) => d.radius ?? 3)
        .style("fill", colors(index.toString()))
        .style("stroke", "black")
        .style("stroke-width", 10);

      circles.exit().remove();
    });
  }, [data]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`}>
        <g className={"x-axis"} />
        <g className={"y-axis"} />
      </g>
    </svg>
  );
};
