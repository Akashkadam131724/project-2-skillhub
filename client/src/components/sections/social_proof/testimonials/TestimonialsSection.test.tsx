import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TestimonialsSection from "./TestimonialsSection";

describe("TestimonialsSection", () => {
  it("renders CMS placeholders and empty item hint when empty", () => {
    const onEditField = vi.fn();

    render(
      <TestimonialsSection
        section_title=""
        sub_title=""
        items={[]}
        onEditField={onEditField}
      />
    );

    expect(screen.getByText("Add title…")).toBeInTheDocument();
    expect(screen.getByText("Add subtitle…")).toBeInTheDocument();
    expect(screen.getByText(/no testimonial/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add testimonial/i })).toBeInTheDocument();
  });

  it("renders mapped testimonial items in CMS mode", () => {
    render(
      <TestimonialsSection
        section_title="Customer stories"
        sub_title="Real teams"
        items={[{ body: "We shipped faster.", title: "Jordan" }]}
        onEditField={() => {}}
      />
    );

    expect(screen.getByText("Customer stories")).toBeInTheDocument();
    expect(screen.getByText("We shipped faster.")).toBeInTheDocument();
    expect(screen.getByText(/Jordan/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit testimonial/i })).toBeInTheDocument();
  });
});
