import React from "react";
import "./App.css";
import { NutritiionTable } from "./components/Nutrition/NutritionItemTable";
import { NutritionItemProvider } from "./context/NutritionItemContextProvider";
import { EventProvider } from "./context/EventContextProvider";
import { ExerciseProvider } from "./context/ExerciseTypeContextProvider";
import ExerciseTypeTable from "./components/Exercises/ExerciseTypeTable";
import { ExerciseInstanceProvider } from "./context/ExerciseInstanceContextProvider";
import { AlertContext } from "./components/generic/actions/AlertContext";
import { createUseStyles, ThemeProvider } from "react-jss";
import { ExerciseInstanceTable } from "./components/Exercises/ExerciseInstance/ExerciseInstanceTable";
import { ExerciseVisualization } from "./components/Data/ExerciseVisualization";
import { theme } from "./styling/theme";
import { classConcat } from "./utils/utils";
import { NutritiionEventTable } from "./components/Nutrition/NutritionEventTable";
import { NutritionEventProvider } from "./context/NutritionEventContextProvider";
import { NutritionVisualization } from "./components/Data/NutritionVisualization";
import { SymptomTable } from "./components/Symptoms/SymptomTable";
import { SymptomProvider } from "./context/SymptomContextProvider";
import { SymptomEventProvider } from "./context/SymptomEventContextProvider";
import { SymptomEventTable } from "./components/Symptoms/SymptomEventTable";

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
      "& table": {
        display: "inline-block",
      },
    },
  },

  { name: "App" }
);

// IMPORTANT: for some ungodly reason, it's best to put a
// "child" context provider above a "parent" context provider

function App() {
  const classes = useStyles();
  return (
    <div className={classConcat("App", classes.app)}>
      <ThemeProvider theme={theme}>
        <AlertContext>
          {/* <AlertTester></AlertTester> */}
          <ExerciseInstanceProvider>
            <NutritionEventProvider>
              <SymptomEventProvider>
                <ExerciseProvider>
                  <EventProvider>
                    <NutritionItemProvider>
                      <SymptomProvider>
                        <h2>Nutrition</h2>
                        <NutritiionTable />
                        <h2>Nutrition History</h2>
                        <NutritiionEventTable />
                        <h2>Nutrition Chart</h2>
                        <NutritionVisualization />
                        <h2>Exercise History</h2>
                        <ExerciseInstanceTable />
                        <h2>Exercise Chart</h2>
                        <ExerciseVisualization />
                        <h2>Exercise Types</h2>
                        <ExerciseTypeTable />
                        <h2>Symptoms</h2>
                        <SymptomTable />
                        <h2>Symptom Events</h2>
                        <SymptomEventTable />
                      </SymptomProvider>
                    </NutritionItemProvider>
                  </EventProvider>
                </ExerciseProvider>
              </SymptomEventProvider>
            </NutritionEventProvider>
          </ExerciseInstanceProvider>
        </AlertContext>
      </ThemeProvider>
    </div>
  );
}

export default App;

// const AlertTester = () => {
//   const alertCtx = useAlertContext();

//   return (
//     <Button
//       onClick={() =>
//         alertCtx.addAlert({
//           children: "sas" + new Date().toTimeString(),
//           type: AlertTypes.NEGATIVE,
//         })
//       }
//     >
//       add alert
//     </Button>
//   );
// };
