import React, { createContext, useState } from "react";
import "./App.css";
import { NutritionItemTable } from "./components/Nutrition/NutritionItemTable";
import EventTable from "./components/Events/EventTable";
import { NutritionItemProvider } from "./context/NutritionItemContextProvider";
import { EventProvider } from "./context/EventContextProvider";
import { InputDay } from "./components/generic/inputs/DateTimeInputs/InputDay";
import { InputDate } from "./components/generic/inputs/DateTimeInputs/InputDate";
import { InputTime } from "./components/generic/inputs/DateTimeInputs/InputTime";
import { ExerciseProvider } from "./context/ExerciseTypeContextProvider";
import ExerciseTypeTable from "./components/Exercises/ExerciseTypeTable";
import { ExerciseInstanceTable } from "./components/Exercises/ExerciseInstance/ExerciseInstanceTable";
import { ExerciseInstanceProvider } from "./context/ExerciseInstanceContextProvider";

export const TestContext = createContext<any>("test context value");

function App() {
  const now = new Date();

  const [hours, setHours] = useState(now.getHours());
  const [minutes, setMinutes] = useState(now.getMinutes());

  return (
    <div className="App">
      <ExerciseInstanceProvider>
        <ExerciseProvider>
          <EventProvider>
            <NutritionItemProvider>
              <NutritionItemTable />
              <EventTable />
            </NutritionItemProvider>
          </EventProvider>
          <ExerciseTypeTable />
          <ExerciseInstanceTable />
        </ExerciseProvider>
      </ExerciseInstanceProvider>

      <InputDate />
      <InputTime
        hh={hours}
        mm={minutes}
        onHourChange={setHours}
        onMinuteChange={setMinutes}
      />
      <input type={"number"} step={"any"} />
    </div>
  );
}

export default App;
