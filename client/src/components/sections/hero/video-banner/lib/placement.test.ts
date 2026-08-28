import { describe, expect, it } from "vitest";
import { isVideoBannerPlacementShowable } from "./placement";

describe("video banner placement", () => {
  it("hides empty banners on public pages", () => {
    expect(isVideoBannerPlacementShowable({ items: [] }, false)).toBe(false);
  });

  it("shows CMS shells even when empty", () => {
    expect(isVideoBannerPlacementShowable({ items: [] }, true)).toBe(true);
  });

  it("shows public banners with a video item", () => {
    expect(
      isVideoBannerPlacementShowable(
        {
          items: [{ href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
        },
        false
      )
    ).toBe(true);
  });
});
