import React, { createContext, useState } from "react";
import "./App.css";
import NutritionTable from "./components/Nutrition/NutritionTable";
import EventTable from "./components/Events/EventTable";
import NutritionItemContextProvider from "./context/NutritionItemContextProvider";
import EContext from "./context/EventContextProvider";
import { InputDay } from "./components/generic/inputs/DateTimeInputs/InputDay";
import { InputDate } from "./components/generic/inputs/DateTimeInputs/InputDate";
import { InputTime } from "./components/generic/inputs/DateTimeInputs/InputTime";

export const TestContext = createContext<any>("test context value");

function App() {
  const now = new Date();

  const [hours, setHours] = useState(now.getHours());
  const [minutes, setMinutes] = useState(now.getMinutes());

  return (
    <div className="App">
      <EContext>
        <NutritionItemContextProvider>
          <NutritionTable />
          <EventTable />
        </NutritionItemContextProvider>
      </EContext>
      <InputDate />
      <InputTime
        hh={hours}
        mm={minutes}
        onHourChange={setHours}
        onMinuteChange={setMinutes}
      />
    </div>
  );
}

export default App;
