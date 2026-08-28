import { describe, expect, it } from "vitest";
import { SECTION_CATALOG, isKnownSectionKey } from "./section-registry.js";
import { SECTION_COMPONENT_ITEM_CONFIGS } from "./configs/index.js";
import { SECTION_MANIFEST } from "./section-manifest";
import {
  getManifestEntry,
  getManifestBehaviorKeys,
} from "./section-manifest-resolve";
import { resolveSectionBehaviorKey } from "./section-items-config.js";

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

describe("section manifest", () => {
  it("registers a public loader for every catalog key", () => {
    for (const section of SECTION_CATALOG) {
      const entry = getManifestEntry(section.key, section.render_key);
      expect(entry?.loadPublic, `missing public loader for ${section.key}`).toBeTruthy();
    }
  });

  it("keeps behavior keys aligned with SECTION_SURFACE entries", () => {
    const manifestKeys = new Set(getManifestBehaviorKeys());
    for (const key of manifestKeys) {
      expect(isKnownSectionKey(key), `manifest key not in catalog: ${key}`).toBe(
        true
      );
    }
  });

  it("resolves catalog aliases to shared manifest entries", () => {
    expect(getManifestEntry("partners")?.loadPublic).toBe(
      SECTION_MANIFEST.partners_marquee.loadPublic
    );
    expect(getManifestEntry("tabs_vertical")?.loadStatic).toBe(
      SECTION_MANIFEST.feature_tabs.loadStatic
    );
    expect(resolveSectionBehaviorKey("page_testimonials")).toBe(
      "customer_testimonials"
    );
  });

  it("marks API-driven catalog sections as user-guide unavailable", () => {
    for (const key of [
      "related_courses",
      "products",
      "catalog",
      "entity_directory",
      "blog_directory",
    ]) {
      expect(getManifestEntry(key)?.userGuide).toBe("unavailable");
    }
  });
});
