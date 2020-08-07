import React, { createContext, useState } from "react";
import "./App.css";
import NutritionTable from "./components/Nutrition/NutritionTable";
import EventTable from "./components/Events/EventTable";
import NutritionItemContextProvider from "./context/NutritionItemContextProvider";
import EContext from "./context/EventContextProvider";
import { InputDay } from "./components/generic/DateTime/InputDay";
import { InputDate } from "./components/generic/DateTime/InputDate";

export const TestContext = createContext<any>("test context value");

function App() {
  return (
    <div className="App">
      <EContext>
        <NutritionItemContextProvider>
          <NutritionTable />
          <EventTable />
        </NutritionItemContextProvider>
      </EContext>
      <InputDate />
    </div>
  );
}

export default App;
