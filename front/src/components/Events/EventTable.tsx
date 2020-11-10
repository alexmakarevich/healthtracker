import React, { useContext } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { EventFields } from "./EventFields";
import { SimpleRow } from "../generic/layout/SimpleRow";

const EventTable = () => {
  const EventsFromContext = useEventContext();

  const newTestEvent = {
    ...eventDefaults,
  };
  return (
    <div>
      <h2>Event Table</h2>

      <table>
        <thead>
          <tr>
            <th>time</th>
            <th>event substance</th>
            <th>items</th>
          </tr>
        </thead>
        <tbody>
          {EventsFromContext.all?.map((event, index) => (
            <EventFields.Wrapper
              event={event}
              initialMode={ItemModes.QuickEdit}
              key={index}
            >
              <SimpleRow>
                <EventFields.Buttons />
                <EventFields.DateTime />
                <>
                  <EventFields.NutritionItems />
                  <EventFields.ExerciseItems />
                </>

                <EventFields.Delete />
              </SimpleRow>
            </EventFields.Wrapper>
          ))}
          <EventFields.Wrapper
            event={eventDefaults}
            initialMode={ItemModes.New}
            key={"new"}
          >
            <SimpleRow>
              <EventFields.Buttons />
              <EventFields.DateTime />
              <EventFields.NutritionItems />
              <EventFields.Delete />
            </SimpleRow>
          </EventFields.Wrapper>
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
