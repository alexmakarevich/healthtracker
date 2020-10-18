import React, { useContext } from "react";
import EContext, { EventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import EventTableRow from "./EventTableRow";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";
import { ItemModes } from "../../utils/utils";

const EventTable = () => {
  const EventsFromContext = useContext(EventContext);
  const NIContext = useContext(NutritionItemContext);

  const newTestEvent = {
    ...eventDefaults,
  };
  return (
    <div>
      <h2>Event Table</h2>

      <table>
        <thead>
          <tr>
            {/* <th>id</th> */}
            <th>time</th>
            <th>event substance</th>
          </tr>
        </thead>
        <tbody>
          {EventsFromContext.all.map((event, index) => (
            <EventTableRow
              event={event}
              key={index}
              mode={ItemModes.QuickEdit}
            />
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => {
            EventsFromContext.create(newTestEvent);
          }}
        >
          add dummy event
        </button>
      </div>
    </div>
  );
};

export default EventTable;
