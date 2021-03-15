import React, { useState } from "react";

export const CheckSoringRerender = () => {
  const [list, setList] = useState(["a", "b", "c", "d"]);

  return (
    <div>
      {list.map((item) => (
        <div key={item}>
          <input value={item} />
        </div>
      ))}
      <button onClick={() => setList([...list.reverse()])}>REVERSUS</button>
    </div>
  );
};
