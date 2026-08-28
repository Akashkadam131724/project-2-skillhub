import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroCenteredSection from "./HeroCenteredSection";

describe("HeroCenteredSection", () => {
  it("renders CMS title placeholder when empty", () => {
    render(
      <HeroCenteredSection
        section_title=""
        sub_title=""
        onEditField={() => {}}
      />
    );

    expect(screen.getByText("Add title…")).toBeInTheDocument();
    expect(screen.getByText("Add subtitle…")).toBeInTheDocument();
    expect(screen.getByText("Add body…")).toBeInTheDocument();
  });

  it("renders CMS editable fields for filled content", () => {
    render(
      <HeroCenteredSection
        section_title="CMS hero title"
        sub_title="CMS hero subtitle"
        data={{ body: "<p>CMS body</p>" }}
        onEditField={() => {}}
      />
    );

    expect(screen.getByText("CMS hero title")).toBeInTheDocument();
    expect(screen.getByText("CMS hero subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("cms-rich-text")).toHaveTextContent("CMS body");
    expect(screen.getAllByTestId("cms-buttons-manage-bar").length).toBeGreaterThan(
      0
    );
  });
});
