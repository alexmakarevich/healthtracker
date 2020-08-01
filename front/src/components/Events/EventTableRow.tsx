import React, { useContext } from "react";
import EContext, { EventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults, eventLogic } from "../../logic/eventLogic";
import NutritionItemCompact from "../Nutrition/NutritionItemCompact";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import { NutritionItem } from "../../logic/nutritionItemLogic";
import NITableRow, { NutritionItemModes } from "../Nutrition/NITableRow";
import AddNutritionItem from "./../Nutrition/AddNutritionItem";
import Removable from "../generic/Removable";

interface Props {
  event: Event;
}

const EventTableRow = ({ event }: Props) => {
  const NIContext = useContext(NutritionItemContext);
  const EventsFromContext = useContext(EventContext);
  // console.log(NIContext.all);

  function addNi(niId: string) {
    const newEvent = eventLogic.addNI(event, niId);
    EventsFromContext.update(newEvent);
  }

  function removeNi(niId: string) {
    const newEvent = eventLogic.removeNI(event, niId);
    EventsFromContext.update(newEvent);
  }

  return (
    <tr>
      <td>{event._id}</td>
      <td>{event.timeStart}</td>
      <td>{event.timeEnd}</td>
      <td>
        {event.children.nutritionItemIds.map((niId) => {
          const ni = NIContext.getOneFromContext(niId);
          return (
            ni && (
              // TODO: fix removable activating for two adjacent items for some reason
              // quite possible that it's deleting the wrong item, actually
              // nope, it's just that the removable transition on the second item gets triggered
              <Removable onRemove={() => removeNi(niId)} key={ni._id}>
                <NutritionItemCompact
                  item={NIContext.getOneFromContext(niId)}
                  initialMode={NutritionItemModes.Show}
                />
              </Removable>
            )
          );
        })}
        <AddNutritionItem
          onAdd={addNi}
          idsToExclude={event.children.nutritionItemIds}
        />
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
