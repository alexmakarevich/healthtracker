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
import { ExerciseInstanceProvider } from "./context/ExerciseInstanceContextProvider";
import { SampleVisualization } from "./components/Data/SampleVisualization";
import { SampleVisualizationTime } from "./components/Data/SampleVisualizationTime";
import { SampleVisualizationUpdate } from "./components/Data/SampleVisualizationUpdate";
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
import { InputDateTime } from "./components/generic/inputs/DateTimeInputs/InputDateTime";
import {
  useDebounce,
  useDebounceCallbackFromValue,
  useDebouncedCallbackVoid,
} from "./hooks/useDebounce";
import { Input } from "./components/generic/inputs/Input";
import { createUseStyles, ThemeProvider } from "react-jss";
import { ExerciseInstanceTable } from "./components/Exercises/ExerciseInstance/ExerciseInstanceTable";
import { ExerciseVisualizationNew } from "./components/Data/ExerciseVisualizationNew";
import { theme } from "./styling/theme";
import { classConcat } from "./utils/utils";
import { AlertTypes } from "./components/generic/layout/Alert";

export const TestContext = createContext<any>("test context value");

const useStyles = createUseStyles(
  {
    app: {
      background: theme.canvas,
      display: "inline-block",
      width: "100%",
      minHeight: "100%",
      color: theme.textMain,
      "& input": {
        color: theme.textMain,
      },
      padding: "2em 1em",
    },
    table: {
      display: "inline-block",
    },
  },

  { name: "App" }
);

function App() {
  const classes = useStyles();
  return (
    <div className={classConcat("App", classes.app)}>
      <ThemeProvider theme={theme}>
        <AlertContext>
          {/* <AlertTester></AlertTester> */}
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
                  <h2>Exercise History</h2>
                  <ExerciseInstanceTable className={classes.table} />
                  <h2>Exercise Graph</h2>

                  <ExerciseVisualizationNew />

                  {/* <DebounceTest /> */}
                  {/* <EventTable /> */}
                  {/* <ExerciseInstanceTable /> */}
                  {/* <svg className={"sas"} style={{ width: 300, height: 300 }}>
                  <use xlinkHref={allSvg + "#" + "gg-folder"} />
                </svg> */}
                  {/* <TestNewTableHook /> */}
                  {/* <CheckSoringRerender /> */}
                  {/* <ExerciseInstanceTableNew /> */}
                  <h2>Exercise Types</h2>

                  <ExerciseTypeTable className={classes.table} />
                </NutritionItemProvider>
              </EventProvider>
            </ExerciseProvider>
          </ExerciseInstanceProvider>
        </AlertContext>
      </ThemeProvider>

      {/* 
      <InputDate />
      <InputDateTime date={date} onChange={(d) => setDate(d)} />

      <InputTime
        hh={hours}
        mm={minutes}
        onHourChange={setHours}
        onMinuteChange={setMinutes}
      /> */}
    </div>
  );
}

export default App;

const AlertTester = () => {
  const alertCtx = useAlertContext();

  return (
    <Button
      onClick={() =>
        alertCtx.addAlert({
          children: "sas" + new Date().toTimeString(),
          type: AlertTypes.NEGATIVE,
        })
      }
    >
      add alert
    </Button>
  );
};
