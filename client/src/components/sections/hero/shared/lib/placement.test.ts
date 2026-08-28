import { describe, expect, it } from "vitest";
import {
  isHeroPlacementShowable,
  shouldHideEmptyHero,
} from "./placement";

describe("hero placement", () => {
  it("hides empty heroes on public pages", () => {
    expect(
      shouldHideEmptyHero("hero_centered", {
        section_title: "",
        sub_title: "",
      })
    ).toBe(true);
  });

  it("shows heroes with copy on public pages", () => {
    expect(
      shouldHideEmptyHero("hero_centered", {
        section_title: "Build workforce capability",
      })
    ).toBe(false);
  });

  it("always shows shells in CMS mode", () => {
    expect(
      isHeroPlacementShowable(
        "hero_centered",
        { section_title: "", sub_title: "" },
        true
      )
    ).toBe(true);
  });

  it("shows public heroes with section image", () => {
    expect(
      isHeroPlacementShowable(
        "hero_split",
        { section_img_url: "/uploads/banners/hero.jpg" },
        false
      )
    ).toBe(true);
  });
});
