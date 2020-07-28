import React, { ReactNode } from "react";
import contextGeneratorFn from "./ContextGenerator";
import { Event } from "./../logic/eventLogic";

interface Props {
  children: ReactNode;
}

const {
  context: EventContext,
  contextProvider: EContextProvider,
} = contextGeneratorFn<Event>({
  apiBaseUrl: "http://localhost:4000/events",
});

function EContext({ children }: Props) {
  return <EContextProvider>{children}</EContextProvider>;
}

export { EventContext };

export default EContext;
