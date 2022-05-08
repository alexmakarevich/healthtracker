import { EventData } from "shared";
import { generateContext } from "./generateContext";

export const EventContext = generateContext<EventData>(
  "http://localhost:4000/events",
  "Event"
);
