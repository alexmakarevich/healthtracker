import React, { useContext } from "react";
import EContext, { EventContext } from "../../context/EventContextProvider";
import { Event } from "../../logic/eventLogic";

const EventTable = () => {
  const EventsFromContext = useContext(EventContext);

  const newTestEvent = new Event();

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
          {EventsFromContext.all.map((event) => (
            <tr>
              <td>{event._id}</td>
              <td>{event.timeStart}</td>
              <td>{event.timeEnd}</td>
            </tr>
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
