import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import NutritionList from "./components/Nutrition/NutritionList";
import NutritionTable from "./components/Nutrition/NutritionTable";
import {
  NutritionItem,
  NutritionItemAPI,
} from "./logic/nutrition/NutritionLogic";

export const TestContext = createContext<any>("test context value");

interface NutritionContextProps {
  items: NutritionItem[];
  getOneById: Function;
  getIdByTempId: Function;
  refresh: Function;
}

export const NutritionContext = createContext<NutritionContextProps>({
  items: [],
  getOneById: () => {},
  getIdByTempId: () => {},
  refresh: () => {},
});

function App() {
  const [nutrition, setNutrition]: [NutritionItem[], Function] = useState([]);

  useEffect(() => {
    console.log("App useEffect called");
    getAllNutrition().then(() =>
      console.log("use effect complete: " + nutrition)
    );
  }, []);

  async function getAllNutrition() {
    console.log("App getAllNutrition called");
    console.log(nutrition);
    const allNutr: NutritionItem[] = await NutritionItemAPI.READ_ALL();
    setNutrition(() => {
      console.log("setNutrition: ");
      console.log(allNutr);
      return allNutr;
    });
    console.log(nutrition);
    return nutrition;
  }

  function getNIIdByTempId(tempId: NutritionItem["tempId"]) {
    getAllNutrition().then(() => {
      {
        console.log("looking for id of tempId: " + tempId);
        console.log(nutrition);
      }
    });
    const ni = nutrition.find((item) => item.tempId === tempId);
    console.log("ni found: " + ni);

    const id = ni?._id;
    console.log("id found: " + id);

    return id;
  }

  function getNutriitionItemByIdFromContext(id: NutritionItem["_id"]) {
    const item = nutrition.find((item) => item._id === id);
    return item;
  }

  const providerValues = {
    items: nutrition,
    getIdByTempId: (tempId: NutritionItem["tempId"]) => getNIIdByTempId(tempId),
    getOneById: (id: NutritionItem["_id"]) =>
      getNutriitionItemByIdFromContext(id),
    refresh: () => getAllNutrition(),
  };

  setTimeout(() => {
    console.log("nutrition delayed: ");
    console.log(nutrition);
  }, 3000);

  return (
    // TODO: move context to separate component
    // figure out why context updates are inconsistent, especially when it comes to a refresh, following a change
    <NutritionContext.Provider value={providerValues}>
      <div className="App">
        <NutritionTable />
      </div>
    </NutritionContext.Provider>
  );
}

export default App;
