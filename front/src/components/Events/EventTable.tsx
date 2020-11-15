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
            <th></th>
            <th>time</th>
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
                  {event.children.exerciseInstanceIds.length === 0 && (
                    <EventFields.NutritionItems />
                  )}
                  {event.children.nutritionItemIds.length === 0 && (
                    <EventFields.ExerciseItems />
                  )}
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
              <>
                <EventFields.NutritionItems />
                <EventFields.ExerciseItems />
              </>
              <EventFields.Delete />
            </SimpleRow>
          </EventFields.Wrapper>
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
