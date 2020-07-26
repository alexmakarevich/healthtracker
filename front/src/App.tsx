import React, { createContext } from "react";
import "./App.css";
import NutritionTable from "./components/Nutrition/NutritionTable";
import NIContext from "./context/NIContext";

export const TestContext = createContext<any>("test context value");

function App() {
  return (
    <div className="App">
      <NIContext>
        <NutritionTable />
      </NIContext>
    </div>
  );
}

export default App;
