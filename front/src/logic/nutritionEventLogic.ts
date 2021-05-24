import { useNutritionEventContext } from "../context/NutritionEventContextProvider";
import { makeUseEntity, UseEntityProps } from "./../hooks/useEntity";
import { useEventContext } from "../context/EventContextProvider";
import { useNutritionItemContext } from "../context/NutritionItemContextProvider";
import { NutritionEventData, nutritionEventDefaults } from "shared";

export const useNutritionEvent = (
  props: UseEntityProps<NutritionEventData>
) => {
  const base = makeUseEntity({
    contextFn: useNutritionEventContext,
    defaults: nutritionEventDefaults,
  })(props);

  const { data } = base;
  const EventContext = useEventContext();
  const NutritionContext = useNutritionItemContext();

  const eventData = EventContext.getOneFromContext(data.eventId);
  const nutritionData = NutritionContext.getOneFromContext(data.nutritionId);

  return {
    ...base,
    eventData,
    nutritionData,
  };
};

export type NutritionEvent = ReturnType<typeof useNutritionEvent>;
