import React, { createContext, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import NutritionList from "./components/Nutrition/NutritionList";
import {
  NutritionItem,
  NutritionItemAPI,
} from "./logic/nutrition/NutritionLogic";
import SelectList from "./components/generic/SelectList";

export const TestContext = createContext<any>("test context value");

interface NutritionContextProps {
  items: NutritionItem[];
  getOneById: Function;
  refresh: Function;
}

export const NutritionContext = createContext<NutritionContextProps>({
  items: [],
  getOneById: () => {},
  refresh: () => {},
});

function App() {
  const [nutrition, setNutrition]: [NutritionItem[], Function] = useState([]);

  useEffect(() => {
    console.log("App useEffect called");
    getAllNutrition();
  }, []);

  async function getAllNutrition() {
    console.log("App getAllNutrition called");

    const allNutr: NutritionItem[] = await NutritionItemAPI.READ_ALL();
    setNutrition(allNutr);
    // return allNutr;
  }

  function getNutriitionItemByIdFromContext(id: NutritionItem["_id"]) {
    const item = nutrition.find((item) => item._id === id);
    return item;
  }

  const providerValues = {
    items: nutrition,
    getOneById: (id: NutritionItem["_id"]) =>
      getNutriitionItemByIdFromContext(id),
    refresh: () => getAllNutrition(),
  };

  return (
    // TODO: move context to separate component
    <NutritionContext.Provider value={providerValues}>
      <div className="App">
        <NutritionList />
      </div>
    </NutritionContext.Provider>
  );
}

export default App;
