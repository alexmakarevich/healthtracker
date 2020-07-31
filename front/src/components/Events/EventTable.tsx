import React, { useContext } from "react";
import EContext, { EventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import EventTableRow from "./EventTableRow";
import { NutritionItemContext } from "../../context/NutritionItemContextProvider";

const EventTable = () => {
  const EventsFromContext = useContext(EventContext);
  const NIContext = useContext(NutritionItemContext);

  const newTestEvent = {
    ...eventDefaults,
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>start</th>
            <th>end</th>
          </tr>
        </thead>
        <tbody>
          {EventsFromContext.all.map((event, index) => (
            <EventTableRow event={event} key={index} />
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
