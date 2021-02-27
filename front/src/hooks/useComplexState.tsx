import React, { useReducer } from "react";

// TODO: check if updateObject could be used here

function useComplexState<S>(initialState: S) {
  function reducer(cuurentState: S, newState: Partial<S>): typeof initialState {
    return { ...cuurentState, ...newState };
  }

  const [complexState, setComplexState] = useReducer(reducer, initialState);

  const reset = () => setComplexState(initialState);

  return { complexState, setComplexState, reset };
}

export { useComplexState };
