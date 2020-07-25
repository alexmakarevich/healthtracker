// use this component to test random shit
import React, { useContext } from "react";
import { NutritionContext } from "../../context/NIContext";

const Dummy = () => {
  const context = useContext(NutritionContext);
  return <div>last item: {context.all[context.all.length - 1]?.title}</div>;
};

export default Dummy;
