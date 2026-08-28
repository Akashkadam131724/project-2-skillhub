import { describe, expect, it } from "vitest";
import { SECTION_CATALOG, isKnownSectionKey } from "./section-registry.js";
import { SECTION_COMPONENT_ITEM_CONFIGS } from "./configs/index.js";

const CORE_KEYS = [
  "hero_centered",
  "hero_classic",
  "hero_split",
  "testimonials",
  "video_banner",
  "learning_path",
  "media_mosaic",
  "in_page_nav",
] as const;

describe("section registry metadata", () => {
  it.each(CORE_KEYS)("catalog includes %s", (sectionKey) => {
    expect(isKnownSectionKey(sectionKey)).toBe(true);
  });

  it("exposes catalog entries with names", () => {
    const hero = SECTION_CATALOG.find((entry) => entry.key === "hero_centered");
    expect(hero?.name).toBeTruthy();
  });

  it("registers CMS item configs for item-driven sections", () => {
    expect(SECTION_COMPONENT_ITEM_CONFIGS.testimonials).toBeTruthy();
    expect(SECTION_COMPONENT_ITEM_CONFIGS.video_banner).toBeTruthy();
    expect(SECTION_COMPONENT_ITEM_CONFIGS.learning_path).toBeTruthy();
  });
});
