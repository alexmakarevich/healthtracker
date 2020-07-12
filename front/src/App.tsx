import React, { createContext, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import NutritionList from "./components/NutritionList";
import { NutritionItem, NIreadAll } from "./logic/nutrition/NutritionLogic";

export const TestContext = createContext<any>("test context value");

export const NutritionContext = createContext<NutritionItem[] | null>(null);

function App() {
  const [nutrition, setNutrition]: [NutritionItem[], Function] = useState([
    { id: "", title: "", _id: "", ingredientIds: [1, 3, 4] },
  ]);

  useEffect(() => {
    console.log("App useEffect called");
    getAllNutrition();
  }, []);

  async function getAllNutrition() {
    console.log("App getAllNutrition called");

    const allNutr: NutritionItem[] = await NIreadAll();
    setNutrition(allNutr);
    // return allNutr;
  }

  return (
    <NutritionContext.Provider value={nutrition}>
      <div className="App">
        <NutritionList />
      </div>
    </NutritionContext.Provider>
  );
}

export default App;
