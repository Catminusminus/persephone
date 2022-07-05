import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { App } from "./App";

describe("Snapshot", () => {
  it("should render", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
