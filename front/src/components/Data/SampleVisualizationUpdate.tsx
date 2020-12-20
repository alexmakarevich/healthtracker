import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Scales, LineAndDotChart } from "./LineAndDotChart";

export const SampleVisualizationUpdate = () => {
  // Create data
  const [data, setData] = useState([
    // { x: 10, y: 20, radius: 3 },
    // { x: 45, y: 90, radius: 15 },
    // { x: 80, y: 50, radius: 7 },
    { x: new Date("2020-12-02"), y: 20, radius: 3 },
    { x: new Date(), y: 90, radius: 15 },
    { x: new Date("2020-12-11"), y: 50, radius: 7 },
    { x: new Date("2020-12-18"), y: 35, radius: 7 },
  ]);

  return (
    <div>
      <LineAndDotChart
        data={data}
        xScale={Scales.Time}
        yScale={Scales.Linear}
        minY={0}
      />

      <ul>
        {data.map((d, index) => (
          <li key={index}>
            <input
              type={"number"}
              value={data[index].y}
              onChange={(e) => {
                const newValue = e.target.value;
                const newData = [
                  ...data.slice(0, index),
                  {
                    ...data[index],
                    y: parseInt(newValue),
                  },
                  ...data.slice(index + 1, data.length),
                ];
                setData(newData);
              }}
            />
            <input
              type="datetime-local"
              value={data[index].x.toISOString().slice(0, 16)}
              onChange={(e) => {
                const newValue = e.target.value;
                const newData = [
                  ...data.slice(0, index),
                  {
                    ...data[index],
                    x: new Date(newValue),
                  },
                  ...data.slice(index + 1, data.length),
                ];
                setData(newData);
              }}
            />
            <button
              onClick={() => {
                const newData = [
                  ...data.slice(0, index),
                  ...data.slice(index + 1, data.length),
                ];
                setData(newData);
              }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setData([...data, { x: new Date(), y: 27, radius: 5 }])}
      >
        add
      </button>
    </div>
  );
};