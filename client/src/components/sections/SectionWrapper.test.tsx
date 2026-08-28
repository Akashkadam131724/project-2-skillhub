import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SectionWrapper from "./SectionWrapper";

describe("SectionWrapper", () => {
  it("renders children inside the content shell", () => {
    render(
      <SectionWrapper id="section-shell">
        <p>Section content</p>
      </SectionWrapper>
    );

    expect(screen.getByText("Section content")).toBeInTheDocument();
    expect(document.getElementById("section-shell")).toBeTruthy();
  });
});
