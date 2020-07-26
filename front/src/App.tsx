import React, { createContext } from "react";
import "./App.css";
import NutritionTable from "./components/Nutrition/NutritionTable";
import EventTable from "./components/Events/EventTable";
import NutritionItemContextProvider from "./context/NutritionItemContextProvider";
import EContext from "./context/EventContextProvider";

export const TestContext = createContext<any>("test context value");

function App() {
  return (
    <div className="App">
      <NutritionItemContextProvider>
        <EContext>
          <NutritionTable />
          <EventTable />
        </EContext>
      </NutritionItemContextProvider>
    </div>
  );
}

export default App;
