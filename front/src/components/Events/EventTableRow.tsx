import React, { useContext, useState } from "react";
import { useEventContext } from "../../context/EventContextProvider";
import { Event, eventDefaults, eventLogic } from "../../logic/eventLogic";
import NutritionItemCompact from "../Nutrition/NutritionItemCompact";
import { useNutritionItemContext } from "../../context/NutritionItemContextProvider";
import AddNutritionItem from "./../Nutrition/AddNutritionItem";
import Removable from "../generic/Removable";
import { ItemModes } from "../../utils/utils";
import { createUseStyles } from "react-jss";
import Collapsible, { Animations } from "../generic/Collapsible";

const styles = () => ({
  itemsWrapper: {
    display: "flex",
    alignItems: "center",
  },
  removeButton: {
    background: "#ee3333",
    display: "flex",
    alignItems: "center",
    height: "25px",
    width: "25px",
    color: "white",
    borderRadius: "50%",
    border: "none",
    justifyContent: "center",
  },
});

const useStyles = createUseStyles(styles, { name: "EventTableRow" });

interface Props {
  event: Event;
  mode: ItemModes;
}

const EventTableRow = ({ event }: Props) => {
  const classes = useStyles();
  const time = new Date(event.time);

  const NIContext = useNutritionItemContext();
  const EventsFromContext = useEventContext();

  function addNi(niId: string) {
    const newEvent = eventLogic.addNI(event, niId);
    EventsFromContext.update(newEvent);
  }

  function removeNi(niId: string) {
    const newEvent = eventLogic.removeNI(event, niId);
    EventsFromContext.update(newEvent);
  }

  function changeDateTime(newDateTime: string) {
    const dateTime = new Date(newDateTime);
    const newEvent = { ...event, time: dateTime.toISOString() };
    EventsFromContext.update(newEvent);
  }

  const [showAddNIinput, setShowAddNIinput] = useState(false);

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
        <div className={classes.itemsWrapper}>
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
          <Collapsible
            isExpanded={!showAddNIinput}
            animation={Animations.ExpandWidth}
          >
            <button onClick={() => setShowAddNIinput(!showAddNIinput)}>
              + nutrition
            </button>
          </Collapsible>
          <Collapsible
            isExpanded={showAddNIinput}
            animation={Animations.ExpandWidth}
          >
            <div className={classes.itemsWrapper}>
              <AddNutritionItem
                onAdd={addNi}
                idsToExclude={event.children.nutritionItemIds}
              />
              <button
                className={classes.removeButton}
                onClick={() => setShowAddNIinput(!showAddNIinput)}
              >
                X
              </button>
            </div>
          </Collapsible>
        </div>
      </td>
      <td>
        <button onClick={() => EventsFromContext.delete(event)}>delete</button>
      </td>
    </tr>
  );
};

export default EventTableRow;
