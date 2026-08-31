import { resolveSectionBehaviorKey } from "./section-items-config";
import { SECTION_MANIFEST } from "./section-manifest";
import type { SectionManifestEntry, SectionUserGuidePreview } from "./section-manifest-types";

/** Resolve manifest entry for a catalog key + optional render_key. */
export function getManifestEntry(
  sectionKey: string,
  renderKey?: string | null
): SectionManifestEntry | null {
  const behavior = resolveSectionBehaviorKey(sectionKey, renderKey ?? undefined);
  return SECTION_MANIFEST[behavior] ?? null;
}

export function getManifestBehaviorKeys(): string[] {
  return Object.keys(SECTION_MANIFEST);
}

export function resolvePublicLoader(
  sectionKey: string,
  renderKey?: string | null
) {
  return getManifestEntry(sectionKey, renderKey)?.loadPublic ?? null;
}

export function resolveStaticLoader(
  sectionKey: string,
  renderKey?: string | null
) {
  return getManifestEntry(sectionKey, renderKey)?.loadStatic ?? null;
}

export function getUserGuidePreview(
  sectionKey: string,
  renderKey?: string | null
): SectionUserGuidePreview | null {
  return getManifestEntry(sectionKey, renderKey)?.userGuide ?? null;
}

export function isSectionStaticUnavailable(
  sectionKey: string,
  renderKey?: string | null
) {
  return getUserGuidePreview(sectionKey, renderKey) === "unavailable";
}

export function isSectionStaticSpecial(
  sectionKey: string,
  renderKey?: string | null
) {
  return getUserGuidePreview(sectionKey, renderKey) === "special";
}
