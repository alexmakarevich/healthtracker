import React, { createContext, useState } from "react";
import "./App.css";
import { NutritionItemTable } from "./components/Nutrition/NutritionItemTable";
import { EventTable } from "./components/Events/EventTable";
import { NutritionItemProvider } from "./context/NutritionItemContextProvider";
import { EventProvider } from "./context/EventContextProvider";
import { InputDate } from "./components/generic/inputs/DateTimeInputs/InputDate";
import { InputTime } from "./components/generic/inputs/DateTimeInputs/InputTime";
import { ExerciseProvider } from "./context/ExerciseTypeContextProvider";
import ExerciseTypeTable from "./components/Exercises/ExerciseTypeTable";
import { ExerciseInstanceTable } from "./components/Exercises/ExerciseInstance/ExerciseInstanceTable";
import { ExerciseInstanceProvider } from "./context/ExerciseInstanceContextProvider";
import { SampleVisualization } from "./components/Data/SampleVisualization";
import { ExerciseVisualization } from "./components/Data/ExerciseVisualization";
import { SampleVisualizationTime } from "./components/Data/SampleVisualizationTime";
import { SampleVisualizationUpdate } from "./components/Data/SampleVisualizationUpdate";
import { ExerciseEventTable } from "./components/Events/ExerciseEventTable";
import { ExerciseInstanceTableNew } from "./components/Exercises/ExerciseInstance/ExerciseInstanceTableNew";
import {
  AlertContext,
  useAlertContext,
} from "./components/generic/actions/AlertContext";

export const TestContext = createContext<any>("test context value");

function App() {
  const now = new Date();

  const [hours, setHours] = useState(now.getHours());
  const [minutes, setMinutes] = useState(now.getMinutes());

  return (
    <div className="App">
      <AlertContext>
        <AlertTester></AlertTester>
        <ExerciseInstanceProvider>
          <ExerciseProvider>
            <EventProvider>
              <NutritionItemProvider>
                <SampleVisualizationUpdate />
                <SampleVisualizationTime />
                <ExerciseVisualization />
                <NutritionItemTable />
                <ExerciseEventTable />
                <EventTable />
              </NutritionItemProvider>
              <ExerciseInstanceTable />
              <ExerciseInstanceTableNew />
            </EventProvider>
            <ExerciseTypeTable />
          </ExerciseProvider>
        </ExerciseInstanceProvider>
      </AlertContext>

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

App.displayName = "";

const AlertTester = () => {
  const alertCtx = useAlertContext();

  return (
    <button
      onClick={() =>
        alertCtx.addAlert({
          content: "sas" + new Date().toTimeString(),
          id: new Date().toUTCString(),
        })
      }
    >
      add alert
    </button>
  );
};
