import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { axisBottom } from "d3";

export enum Scales {
  Linear = "Linear",
  Time = "Time",
}

export interface Data<xType extends Scales, yType extends Scales> {
  x: xType extends Scales.Time ? Date : number;
  y: yType extends Scales.Time ? Date : number;
  radius?: number;
  label?: string | number;
}

enum Sort {
  x,
  y,
  none,
}

interface LineAndDotChartProps<XScale extends Scales, YScale extends Scales> {
  xScale: XScale;
  yScale: YScale;
  series: { data: Data<XScale, YScale>[]; legend?: string }[];
  hasLine?: boolean;
  hasDots?: boolean;
  sort?: Sort;
  minX?: Data<XScale, YScale>["x"];
  maxX?: Data<XScale, YScale>["x"];
  minY?: Data<XScale, YScale>["y"];
  maxY?: Data<XScale, YScale>["y"];
}

export const LineAndDotChart = <xType extends Scales, yType extends Scales>({
  series,
  xScale,
  yScale,
  hasLine = true,
  hasDots = true,
  sort = xScale === Scales.Time ? Sort.x : Sort.none,
  minX: minXForce,
  maxX: maxXForce,
  minY: minYForce,
  maxY: maxYForce,
}: LineAndDotChartProps<xType, yType>) => {
  type DefinedData = Data<xType, yType>;
  type DefinedSeries = { data: DefinedData[]; legend?: string };

  const sortByX = ({ data, ...rest }: DefinedSeries): DefinedSeries => ({
    data: data.slice().sort((a, b) => (a.x < b.x ? -1 : 0)),
    ...rest,
  });

  const sortByY = ({ data, ...rest }: DefinedSeries): DefinedSeries => ({
    data: data.slice().sort((a, b) => (a.y < b.y ? -1 : 0)),
    ...rest,
  });

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  console.log({ 1: colors("1") });

  const dataSortedByX = series.map((datum) => sortByX(datum));
  const dataSortedByY = series.map((datum) => sortByY(datum));

  const seriesFlat = series.reduce((prev, curr) => ({
    data: [...prev.data, ...curr.data],
  }));

  const minX = minXForce ?? sortByX(seriesFlat).data[0].x ?? 0;
  const maxX =
    maxXForce ?? sortByX(seriesFlat).data[seriesFlat.data.length - 1]?.x ?? 0;
  const minY = minYForce ?? sortByY(seriesFlat).data[0]?.y ?? 0;
  const maxY =
    maxYForce ?? sortByY(seriesFlat).data[seriesFlat.data.length - 1]?.y ?? 0;

  const adjustedData =
    sort === Sort.x ? dataSortedByX : Sort.y ? dataSortedByY : series;

  // set the dimensions and margins of the graph
  const margin = { top: 60, right: 60, bottom: 60, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    const format = d3.format(".2f");

    // add/update axes
    svg
      .select<SVGGElement>(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x));

    svg.select<SVGGElement>(".y-axis").call(d3.axisLeft(y));

    const defaultRadius = 3;

    adjustedData.forEach((datum, index) => {
      // add/update line
      if (hasLine) {
        svg
          .selectAll("path.line-" + index)
          .data([datum.data])
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
          .attr("stroke", colors(index.toString()))
          .attr("stroke-width", 1.5);
      }

      if (hasDots) {
        // add/update dots
        const circles = svg
          .selectAll<SVGCircleElement, DefinedData>("circle.series-" + index)
          .data(datum.data);

        circles
          .enter()
          .append("circle")
          .merge(circles)
          .transition()
          .duration(150)
          .attr("class", "series-" + index)
          .attr("cx", (d) => x(d.x))
          .attr("opacity", 0.5)
          .attr("z-axis", 5)
          .attr("cy", (d) => y(d.y))
          .attr("r", (d) => d.radius ?? defaultRadius)
          .style("fill", colors(index.toString()))
          .style("stroke", "black")
          .style("stroke-width", 20);

        const textLabels = svg
          .selectAll<SVGTextElement, DefinedData>("text.series-" + index)
          .data(datum.data);

        textLabels
          .enter()
          .append("text")
          .merge(textLabels)
          .transition()
          .duration(150)
          .attr("class", "series-" + index)
          .attr("z-axis", 10)
          .attr("text-anchor", "bottom")
          .style("fill", colors(index.toString()))
          .attr("alignment-baseline", "bottom")
          .attr("dx", (d) => x(d.x))
          .attr(
            "dy",
            (d) =>
              y(typeof d.y === "number" ? d.y : d.y) -
              (d.radius ?? defaultRadius) -
              5
          )
          .text((d) => d.label ?? "");

        circles.exit().remove();
        textLabels.exit().remove();
      }
    });
  }, [adjustedData, colors, series, hasDots, hasLine, height, x, y]);

  return (
    <>
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
        overflow={"visible"}
      >
        <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`}>
          <g className={"x-axis"} />
          <g className={"y-axis"} />
        </g>
      </svg>
      <div>
        {adjustedData.map((datum, index) => (
          <span style={{ padding: 10, color: colors(index.toString()) }}>
            {datum.legend}
          </span>
        ))}
      </div>
    </>
  );
};
