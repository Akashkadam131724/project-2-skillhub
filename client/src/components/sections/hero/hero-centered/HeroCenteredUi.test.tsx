import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroCenteredUi from "./HeroCenteredUi";

describe("HeroCenteredUi", () => {
  it("renders title and subtitle", () => {
    render(
      <HeroCenteredUi
        title="Build workforce capability that moves with your business"
        subtitle="Upskill teams with role-based paths."
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Build workforce capability that moves with your business",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Upskill teams with role-based paths.")
    ).toBeInTheDocument();
  });

  it("renders footer slot when provided", () => {
    render(
      <HeroCenteredUi
        title="Hello"
        footer={<button type="button">Get started</button>}
      />
    );

    expect(
      screen.getByRole("button", { name: "Get started" })
    ).toBeInTheDocument();
  });
});
