import React, { useContext } from "react";
import EContext, { EventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import NutritionItemCompact, {
  NutritionItemModes,
} from "../Nutrition/NutritionItemCompact";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import { NutritionItem } from "../../logic/nutritionItemLogic";
import NITableRow from "../Nutrition/NITableRow";

interface Props {
  event: Event;
}

const EventTableRow = ({ event }: Props) => {
  const NIContext = useContext(NutritionItemContext);
  const EventsFromContext = useContext(EventContext);
  console.log(NIContext.all);

  return (
    <tr>
      <td>{event._id}</td>
      <td>{event.timeStart}</td>
      <td>{event.timeEnd}</td>
      <td>{event.children.nutritionItemIds.toString()}</td>
      <td>
        {event.children.nutritionItemIds.map(
          (niId) => {
            console.log(niId);
            const sas: NutritionItem = NIContext.getOneFromContext(
              "5f1db52ab1db3608f0f85c41"
            );
            console.log(sas);
            return (
              <NutritionItemCompact
                item={sas}
                initialMode={NutritionItemModes.Show}
              />
            );
          }

          // <NutritionItemCompact
          //   item={NIContext.getOneFromContext(niId)}
          //   initialMode={NutritionItemModes.Show}
          // />
        )}
      </td>
      <td>
        <button onClick={() => EventsFromContext.delete(event._id)}>
          delete
        </button>
      </td>
    </tr>
  );
};

export default EventTableRow;
