import { eventDefaults, useEvent } from "./eventLogic";
import { useNutritionEventContext } from "../context/NutritionEventContextProvider";
import { makeUseEntity, UseEntityProps } from "./../hooks/useEntity";
import { Basic, BASIC_DEFAULTS } from "./sharedLogic";
import { useEventContext } from "../context/EventContextProvider";
import { useNutritionItemContext } from "../context/NutritionItemContextProvider";
import { ItemModes } from "../utils/utils";

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

  const event = useEvent({
    data: eventData ? eventData : eventDefaults,
    initialMode: eventData ? ItemModes.QuickEdit : ItemModes.New,
  });

  const create = () =>
    event.mode === ItemModes.New
      ? event.create?.(undefined, {
          onSuccess: (newEvent) =>
            base.create?.({ ...data, eventId: newEvent._id }),
        })
      : base.create?.(undefined, {
          // delete newly created unused event
          onError: () => event.remove?.(),
        });

  return {
    ...base,
    create,
    eventData,
    event,
    nutritionData,
  };
};
