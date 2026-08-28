import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroCenteredPublicSection from "./HeroCenteredPublicSection";

describe("HeroCenteredPublicSection", () => {
  it("renders nothing when placement is empty", () => {
    const { container } = render(
      <HeroCenteredPublicSection section_title="" sub_title="" />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders mapped hero copy on public pages", () => {
    render(
      <HeroCenteredPublicSection
        section_title="Build workforce capability"
        sub_title="Upskill teams with role-based paths."
        data={{ body: "<p>Learn faster.</p>" }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Build workforce capability" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Upskill teams with role-based paths.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("cms-rich-text")).toHaveTextContent(
      "Learn faster."
    );
  });

  it("does not render CMS placeholder copy", () => {
    render(
      <HeroCenteredPublicSection section_title="Public hero" sub_title="" />
    );

    expect(screen.queryByText(/add title/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("cms-buttons-manage-bar")).not.toBeInTheDocument();
  });
});
