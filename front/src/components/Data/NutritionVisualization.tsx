import React from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { useNutritionEventContext } from "../../context/NutritionEventContextProvider";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import { useEvent } from "../../logic/eventLogic";
import { NutritionItemDAO } from "../../logic/nutritionItemLogic";
import { LineAndDotChart, Scales } from "./LineAndDotChart";

interface Datum {
  x: Date;
  y: string;
  label?: string | number;
  radius?: number;
}

export const NutritionVisualization = () => {
  const eventCtx = useEventContext();
  const nutritionCtx = useNutritionItemContext();
  const nutritionEventCtx = useNutritionEventContext();

  if (!eventCtx.all || !nutritionCtx.all || !nutritionEventCtx.all) {
    return null;
  }

  let chartData: { data: Datum[] }[] = [];

  let groupedChartData: Record<string, { data: Datum[]; legend?: string }> = {};

  nutritionEventCtx.all.forEach((nE) => {
    const event = eventCtx.getOneFromContext(nE.eventId);

    recursivelyAddIngredients(nE.nutritionId);

    function recursivelyAddIngredients(nutritionId: string) {
      const nutrition = nutritionCtx.getOneFromContext(nutritionId);

      if (event && nutrition) {
        if (!groupedChartData[nE.nutritionId]) {
          groupedChartData[nE.nutritionId] = {
            data: [],
          };
        }

        groupedChartData[nE.nutritionId].data.push({
          y: nutrition.title,
          x: new Date(event.time),
          radius: 10,
        });

        nutrition.ingredientIds.forEach((id) => recursivelyAddIngredients(id));
      }
    }
  });

  chartData = Object.values(groupedChartData);

  return (
    <>
      <LineAndDotChart
        xScale={Scales.Time}
        yScale={Scales.Ordinal}
        series={chartData}
        hasLine={false}
      />
    </>
  );
};
