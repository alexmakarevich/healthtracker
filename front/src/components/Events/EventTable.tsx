import React, { useContext } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults } from "../../logic/eventLogic";
import { ItemModes } from "../../utils/utils";
import { EventFields } from "./EventFields";
import { SimpleRow } from "../generic/layout/SimpleRow";

export const EventTable = () => {
  const EventsFromContext = useEventContext();

  // TODO: deprecate or rewrite with parent/child logic between events and instances moved into instances,
  // i.e. instead of interating of "children" field of event, use "eventid" field in and exercise instance, or nutrition instance

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
                {/* <EventFields.Buttons /> */}
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
              {/* <EventFields.Buttons /> */}
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
