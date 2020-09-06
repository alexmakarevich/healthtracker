import React, { useContext } from "react";
import EContext, { EventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults, eventLogic } from "../../logic/eventLogic";
import NutritionItemCompact from "../Nutrition/NutritionItemCompact";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import { NutritionItem } from "../../logic/nutritionItemLogic";
import NITableRow from "../Nutrition/NITableRow";
import AddNutritionItem from "./../Nutrition/AddNutritionItem";
import Removable from "../generic/Removable";
import { ItemModes } from "../../utils/utils";

interface Props {
  event: Event;
  mode: ItemModes;
}

const EventTableRow = ({ event }: Props) => {
  const time = new Date(event.time);
  const timeOffset = time.getTimezoneOffset();
  const timeMiliseconds = time.getMilliseconds();
  const timeLocalMiliseconds = timeMiliseconds - timeOffset * 60000;

  const timeLocal = new Date(time.setMinutes(time.getMinutes() - timeOffset));

  console.log(timeOffset);
  console.log(timeLocalMiliseconds);
  console.log(timeLocal);

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

  function changeDateTime(newDateTime: string) {
    console.log(newDateTime);

    const dateTime = new Date(newDateTime);
    const newEvent = { ...event, time: dateTime.toISOString() };
    EventsFromContext.update(newEvent);
  }

  return (
    <tr>
      <td>
        <input
          type="datetime-local"
          value={time.toISOString().slice(0, 16)}
          onChange={(e) => changeDateTime(e.target.value)}
        />
      </td>
      <td>
        {event.children.nutritionItemIds.map((niId) => {
          const ni = NIContext.getOneFromContext(niId);
          return (
            ni && (
              <Removable onRemove={() => removeNi(niId)} key={ni._id}>
                <NutritionItemCompact
                  item={NIContext.getOneFromContext(niId)}
                  initialMode={ItemModes.Show}
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
