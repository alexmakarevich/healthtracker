import * as d3 from "d3";
import { axisBottom } from "d3";
import React, { useEffect, useRef } from "react";
import { NutritionItemData } from "shared";
import { useEventContext } from "../../context/EventContextProvider";
import { useNutritionEventContext } from "../../context/NutritionEventContextProvider";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import { sortByX } from "./ChartParts";

interface Datum {
  x: Date;
  y: string;
  label?: string | number;
  color: string;
  radius?: number;
}

export const NutritionVisualization = () => {
  const eventCtx = useEventContext();
  const nutritionCtx = useNutritionItemContext();
  const nutritionEventCtx = useNutritionEventContext();
  const ref = useRef(null);

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // if (!eventCtx.all || !nutritionCtx.all || !nutritionEventCtx.all) {
  //   return null;
  // }

  function flattenIngredients(nutrition: NutritionItemData) {
    let ingredients: NutritionItemData[] = [];
    nutrition.ingredientIds.forEach((id) => {
      // making sure there are no hierarchy loops
      if (
        id === nutrition._id ||
        ingredients.find((i) => i._id === id) ||
        !id
      ) {
        return;
      }
      const ingr = nutritionCtx.getOneFromContext(id);
      if (!!ingr) {
        ingredients.push(ingr, ...flattenIngredients(ingr));
      }
    });
    return ingredients;
  }
  const flatNutritionList = (nutritionCtx.all ?? []).map((n) => ({
    self: n,
    flatIngredients: flattenIngredients(n),
  }));

  let chartData: { data: Datum[] } = { data: [] };

  (nutritionEventCtx.all ?? []).forEach((nE, index) => {
    const event = eventCtx.getOneFromContext(nE.eventId);
    const flatNutrition = flatNutritionList.find(
      (n) => n.self._id === nE.nutritionId
    );

    const color = colors(index.toString());

    if (event && flatNutrition) {
      chartData.data.push({
        y: flatNutrition.self.title,
        x: new Date(event.time),
        radius: 15,
        color,
      });

      flatNutrition.flatIngredients.forEach((ingr) =>
        chartData.data.push({
          y: ingr.title,
          x: new Date(event.time),
          radius: 8,
          color,
        })
      );
    }
  });

  // set the dimensions and margins of the graph
  const margin = { top: 60, right: 60, bottom: 60, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const minX = (sortByX(chartData).data[0]?.x as Date) ?? new Date();
  const maxX =
    (sortByX(chartData).data[chartData.data.length - 1]?.x as Date) ??
    new Date();

  const x = d3.scaleTime().domain([minX, maxX]).range([0, width]);

  const yDomain = (nutritionCtx.all ?? []).map((n) => n.title);
  const y = d3.scalePoint().domain(yDomain).range([height, 0]);

  useEffect(() => {
    // get svg base
    const svg = d3.select(ref.current);

    // add/update axes
    svg
      .select<SVGGElement>(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x));

    svg.select<SVGGElement>(".y-axis").call(d3.axisLeft(y));

    // add/update dots
    const circles = svg
      .selectAll<SVGCircleElement, Datum>("circle.series-")
      .data(chartData.data);

    circles
      .enter()
      .append("circle")
      .merge(circles)
      .transition()
      .duration(150)
      .attr("class", "series-")
      .attr("cx", (d) => x(d.x))
      .attr("opacity", 0.5)
      .attr("z-axis", 5)
      .attr("cy", (d) => y(d.y) ?? 0)
      .attr("r", (d) => d.radius ?? 10)
      .style("fill", (d) => d.color)
      .style("stroke", "black")
      .style("stroke-width", 20);

    circles.exit().remove();
  }, [chartData.data, colors, height, x, y]);

  return (
    <>
      <>
        <svg
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
          overflow={"visible"}
        >
          <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`}>
            <g
              className={"x-axis"}
              //  ref={xRef}
            />
            <g
              className={"y-axis"}
              // ref={yRef}
            />
          </g>
        </svg>
      </>
      {/* <LineAndDotChart
        xScale={Scales.Time}
        yScale={Scales.Ordinal}
        series={chartData}
        hasLine={false}
      /> */}
    </>
  );
};
