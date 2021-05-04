import { useNutritionEventContext } from "../context/NutritionEventContextProvider";
import { makeUseEntity, UseEntityProps } from "./../hooks/useEntity";
import { Basic, BASIC_DEFAULTS } from "./sharedLogic";
import { useEventContext } from "../context/EventContextProvider";
import { useNutritionItemContext } from "../context/NutritionItemContextProvider";

export interface NutritionEventDAO extends Basic {
  eventId: string;
  nutritionId: string;
}

export const nutritionEventDefaults: NutritionEventDAO = {
  ...BASIC_DEFAULTS,
  eventId: "",
  nutritionId: "",
};

export const useNutritionEvent = (props: UseEntityProps<NutritionEventDAO>) => {
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
