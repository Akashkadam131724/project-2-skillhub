import { describe, expect, it } from "vitest";
import {
  isTestimonialShowable,
  resolveTestimonialUiItems,
} from "./map";

describe("testimonials map", () => {
  it("filters empty items on public pages", () => {
    const items = resolveTestimonialUiItems("testimonials", [
      { status: false, body: "hidden" },
      { body: "Great platform", title: "Alex" },
      { body: "", title: "" },
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]?.quote).toBe("Great platform");
    expect(items[0]?.author).toBe("Alex");
  });

  it("keeps draft items in CMS mode", () => {
    const items = resolveTestimonialUiItems(
      "testimonials",
      [{ body: "Draft only" }],
      { cmsMode: true }
    );

    expect(items).toHaveLength(1);
  });

  it("detects showable testimonial rows", () => {
    expect(isTestimonialShowable({ quote: "Solid", author: "Sam" })).toBe(true);
    expect(isTestimonialShowable({ body: "", title: "" })).toBe(false);
  });
});
