import type { ComponentType } from "react";

export type SectionUserGuidePreview = "static" | "unavailable" | "special";

export type SectionModule = { default: ComponentType<Record<string, unknown>> };

export type SectionManifestEntry = {
  /** Lazy import for public pages (`*PublicSection`). */
  loadPublic: () => Promise<SectionModule>;
  /** Lazy import for user-guide (`*Static`). */
  loadStatic?: () => Promise<SectionModule>;
  /** How the user-guide preview should render this section. */
  userGuide: SectionUserGuidePreview;
};

export function defineSection(
  loadPublic: SectionManifestEntry["loadPublic"],
  options?: {
    loadStatic?: SectionManifestEntry["loadStatic"];
    userGuide?: SectionUserGuidePreview;
  }
): SectionManifestEntry {
  const loadStatic = options?.loadStatic;
  const userGuide =
    options?.userGuide ??
    (loadStatic ? "static" : "unavailable");

  return { loadPublic, loadStatic, userGuide };
}
