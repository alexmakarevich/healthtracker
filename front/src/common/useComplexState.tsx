import React, { useReducer } from "react";

// TODO: check if updateObject could be used here

const useComplexState = (initialState: any) => {
  interface PartialProps extends Partial<typeof initialState> {}

  function reducer(
    cuurentState: typeof initialState,
    newState: PartialProps
  ): typeof initialState {
    return { ...cuurentState, ...newState };
  }

  const [complexState, setComplexState] = useReducer(reducer, initialState);

  const reset = () => setComplexState(initialState);

  return { complexState, setComplexState, reset };
};

export { useComplexState };
