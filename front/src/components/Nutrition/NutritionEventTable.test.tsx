import {
  render,
  wait,
  waitFor,
  waitForElement,
  within,
} from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "react-jss";
import { NutritionEventData } from "shared";
import { EventProvider } from "../../context/EventContextProvider";
import { ExerciseInstanceProvider } from "../../context/ExerciseInstanceContextProvider";
import { ExerciseProvider } from "../../context/ExerciseTypeContextProvider";
import { ContextProps } from "../../context/generateContext";
import {
  NutritionEventEmptyProvider,
  NutritionEventProvider,
} from "../../context/NutritionEventContextProvider";
import { NutritionItemProvider } from "../../context/NutritionItemContextProvider";
import { SymptomProvider } from "../../context/SymptomContextProvider";
import { SymptomEventProvider } from "../../context/SymptomEventContextProvider";
import { theme } from "../../styling/theme";
import { AlertContext } from "../generic/actions/AlertContext";
import { NutritiionEventTable } from "./NutritionEventTable";

// jest.mock("../../context/NutritionEventContextProvider");

describe(__filename, () => {
  // nutrCtxProvider

  const fakeData: NutritionEventData = {
    eventId: "id",
    nutritionId: "1",
    _id: "1",
    createdOn: "",
    lastModifiedOn: "",
  };

  const contexValue: ContextProps<NutritionEventData> = {
    all: [fakeData],
    create: () => new Promise((res, rej) => res(fakeData)),
    delete: () => new Promise((res, rej) => res()),
    update: () => new Promise((res, rej) => res(fakeData)),
    getOneFromContext: () => fakeData,
    refresh: () => {},
  };

  it("renders", async () => {
    // TODO: rewrite with the whole backend being mocked. here the actual backend must be started.

    const { container, findAllByText, findAllByRole, getAllByRole } = render(
      <ThemeProvider theme={theme}>
        <AlertContext>
          <ExerciseInstanceProvider>
            {/* <NutritionEventEmptyProvider value={contexValue}> */}
            <NutritionEventProvider>
              <SymptomEventProvider>
                <ExerciseProvider>
                  <EventProvider>
                    <NutritionItemProvider>
                      <SymptomProvider>
                        <NutritiionEventTable />
                      </SymptomProvider>
                    </NutritionItemProvider>
                  </EventProvider>
                </ExerciseProvider>
              </SymptomEventProvider>
            </NutritionEventProvider>
            {/* </NutritionEventEmptyProvider> */}
          </ExerciseInstanceProvider>
        </AlertContext>
      </ThemeProvider>
    );

    const tbody = container.getElementsByTagName("tbody");

    const rowsFromContainer = container.getElementsByTagName("td");

    console.log("tds", rowsFromContainer.length);

    await waitFor(() => expect(getAllByRole("row", {}).length).toBe(15));

    const rows = await findAllByRole("row", {});

    console.log("rows", rows.length);

    // rows.forEach((row) => {
    //   const inputs = within(row).queryAllByRole("spinbutton");
    //   console.log("inputs", inputs.length);
    //   inputs.forEach((i) => console.log("input txt", i.getAttribute("value")));
    // });

    const dateTimesFromTable = rows.map((row) => {
      const inputs = within(row).queryAllByRole("spinbutton");
      console.log("inputs", inputs.length);
      const dateTimes = inputs.map((i) => i.getAttribute("value"));
      return dateTimes;
    });

    console.log({ dateTimesFromTable });

    const oranges = await findAllByText("oranges");

    console.log("oranges: ", oranges.length);

    const tomatoes = await findAllByText("tomatoes");

    console.log("tomatoes: ", tomatoes.length);
    // expect(getByText("something")).toBeTruthy();
    const rowsAgain = await findAllByRole("row", {});

    console.log("rowsAgain", rowsAgain.length);
    console.log("rows again", rows.length);
  });
});
