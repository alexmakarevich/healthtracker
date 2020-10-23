import React, { useReducer } from "react";

const useComplexState = (initialState: any) => {
  interface PartialProps extends Partial<typeof initialState> {}

  function reducer(
    cuurentState: typeof initialState,
    newState: PartialProps
  ): typeof initialState {
    return { ...cuurentState, ...newState };
  }

  const [state, setComplexState] = useReducer(reducer, initialState);

  const reset = () => setComplexState(initialState);

  return { state, setComplexState, reset };
};

export { useComplexState };
