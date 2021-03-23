import React, { createContext, useCallback, useState } from "react";
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
import { v4 as uuid } from "uuid";
import { CheckHowHooksRerender } from "./components/Sandbox/CheckHowHooksRerender";
import { TestNewTableHook } from "./hooks/useCustomTableNew.";
import { CheckSoringRerender } from "./components/Sandbox/CheckSoringRerender";
import { Icon, IconSizes } from "./components/generic/styling/Icon";
import allSvg from "./icons/all.svg";
import { Button } from "./components/generic/buttons/Button";
import { ExerciseEventTableNew } from "./components/Events/ExerciseEventTableNew";
import { InputDateTime } from "./components/generic/inputs/DateTimeInputs/InputDateTime";
import { debounce, debouncePajeet, debounceVoid } from "./utils/utils";
import {
  useDebounce,
  useDebounceCallbackFromValue,
  useDebouncedCallbackVoid,
} from "./hooks/useDebounce";
import { Input } from "./components/generic/inputs/Input";

export const TestContext = createContext<any>("test context value");

function App() {
  const now = new Date();

  const [hours, setHours] = useState(now.getHours());
  const [minutes, setMinutes] = useState(now.getMinutes());

  const [date, setDate] = useState(now);

  return (
    <div className="App">
      <AlertContext>
        <AlertTester></AlertTester>
        <ExerciseInstanceProvider>
          <ExerciseProvider>
            <EventProvider>
              <NutritionItemProvider>
                {/* <SampleVisualizationUpdate />
                <SampleVisualizationTime />
                <ExerciseVisualization />
                <NutritionItemTable /> */}
                {/* <CheckHowHooksRerender /> */}
                {/* <ExerciseEventTable /> */}
                <ExerciseEventTableNew />
                <DebounceTest />

                {/* <EventTable /> */}
                <ExerciseInstanceTable />

                {/* <svg className={"sas"} style={{ width: 300, height: 300 }}>
                  <use xlinkHref={allSvg + "#" + "gg-folder"} />
                </svg> */}

                {/* <TestNewTableHook /> */}
                {/* <CheckSoringRerender /> */}
                {/* <ExerciseInstanceTableNew /> */}
                <ExerciseTypeTable />
              </NutritionItemProvider>
            </EventProvider>
          </ExerciseProvider>
        </ExerciseInstanceProvider>
      </AlertContext>

      <InputDate />
      <InputDateTime date={date} onChange={(d) => setDate(d)} />

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

App.displayName = "";

const AlertTester = () => {
  const alertCtx = useAlertContext();

  return (
    <Button
      onClick={() =>
        alertCtx.addAlert({
          children: "sas" + new Date().toTimeString(),
        })
      }
    >
      add alert
    </Button>
  );
};

const DebounceTest = () => {
  // const [debounced, value, setValue] = useDebounceBad("", 2000);
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 2000);
  useDebounceCallbackFromValue(value, (v) => console.log(v), 2000);
  const debouncedCB = useDebouncedCallbackVoid(
    (param: string) => console.log("DB", param),
    2000
  );

  const debouncedAction = useCallback(() => {
    // console.log("not debounced");
    setTimeout(() => console.log("debouncederino"), 1000);
    // debounce(() => console.log("debouncePajeet"), 1000);vbhuigfhg
  }, []);

  return (
    <>
      <Input
        value={value}
        onChange={(e) => {
          debouncedCB(e.target.value);
          setValue(e.target.value);
        }}
      />
      <span>
        {value}
        {debounced}
      </span>
    </>
  );
};
