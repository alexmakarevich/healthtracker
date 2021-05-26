import { useReducer } from "react";

function useComplexState<S>(initialState: S) {
  function reducer(cuurentState: S, newState: Partial<S>): typeof initialState {
    return { ...cuurentState, ...newState };
  }

  const [complexState, setComplexState] = useReducer(reducer, initialState);

  const reset = () => setComplexState(initialState);

  return { complexState, setComplexState, reset };
}

export { useComplexState };
