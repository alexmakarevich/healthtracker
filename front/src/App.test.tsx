import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

// TODO: real test

test("renders learn react link", () => {
  const { getAllByText } = render(<App />);
  const linkElement = getAllByText(/Nutrition/i);
  expect(linkElement[0]).toBeInTheDocument();
});
