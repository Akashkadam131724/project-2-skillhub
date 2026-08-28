import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TestimonialsPublicSection from "./TestimonialsPublicSection";

describe("TestimonialsPublicSection", () => {
  it("renders nothing when there are no showable items", () => {
    const { container } = render(
      <TestimonialsPublicSection
        section_title="Testimonials"
        items={[{ body: "", title: "" }]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders testimonial items on public pages", () => {
    render(
      <TestimonialsPublicSection
        section_title="What teams say"
        items={[{ body: "Great platform", title: "Alex" }]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "What teams say" })
    ).toBeInTheDocument();
    expect(screen.getByText("Great platform")).toBeInTheDocument();
    expect(screen.getByText(/Alex/)).toBeInTheDocument();
  });

  it("does not render CMS item controls", () => {
    render(
      <TestimonialsPublicSection
        section_title="Reviews"
        items={[{ body: "Solid product", title: "Sam" }]}
      />
    );

    expect(screen.queryByText(/no .* yet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/edit testimonial/i)).not.toBeInTheDocument();
  });
});
