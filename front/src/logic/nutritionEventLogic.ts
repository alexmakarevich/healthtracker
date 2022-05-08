import { NutritionEventContext } from "../context/NutritionEventContextProvider";
import { makeUseEntity, UseEntityProps } from "./../hooks/useEntity";
import { EventContext } from "../context/EventContextProvider";
import { NutritionItemContext } from "../context/NutritionItemContextProvider";
import { NutritionEventData, nutritionEventDefaults } from "shared";

export const useNutritionEvent = (
  props: UseEntityProps<NutritionEventData>
) => {
  const base = makeUseEntity({
    contextFn: NutritionEventContext.use,
    defaults: nutritionEventDefaults,
  })(props);

  const { data } = base;
  const events = EventContext.use();
  const nutritionItems = NutritionItemContext.use();

  const eventData = events.getOneFromContext(data.eventId);
  const nutritionData = nutritionItems.getOneFromContext(data.nutritionId);

  return {
    ...base,
    eventData,
    nutritionData,
  };
};

export type NutritionEvent = ReturnType<typeof useNutritionEvent>;
