import React, { ReactNode } from "react";
import { ExerciseType } from "../logic/exerciseTypeLogic";
import contextGeneratorFn from "./ContextGenerator";

interface Props {
  children: ReactNode;
}

const {
  context: ExerciseTypeContext,
  contextProvider: ETContextProvider,
} = contextGeneratorFn<ExerciseType>({
  apiBaseUrl: "http://localhost:4000/exerciseTypes",
});

function ExerciseTypeContextProvider({ children }: Props) {
  return <ETContextProvider>{children}</ETContextProvider>;
}

export { ExerciseTypeContext };

export default ExerciseTypeContextProvider;
