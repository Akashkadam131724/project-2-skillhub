import { normalizeContentScope } from "@/lib/cms/content-scope";
import { normalizeSectionTheme, sectionSupportsBandTheme } from "./section-theme";
import {
  updatePageSectionTag,
  updateSection,
  upsertEntityPageSection,
} from "@/lib/api/cms-api";

/** DB value for top-level `section_theme` (null/"" = inherit). */
export function sectionThemeDbValue(raw) {
  const theme = normalizeSectionTheme({ section_theme: raw });
  return theme === "inherit" ? null : theme;
}

/**
 * Save section theme on the correct layer — Section catalog, page tag, or entity
 * placement. Never writes `data.section_theme`.
 */
export async function saveSectionThemeForPlacement(
  section,
  { pageKey, entityId, rawValue }
) {
  const section_theme = sectionThemeDbValue(rawValue);
  const scope = normalizeContentScope(section.content_scope);
  const sectionKey = section.section_key;

  if (scope === "global") {
    if (!sectionKey) throw new Error("Missing section key");
    return updateSection(sectionKey, {
      section_theme: section_theme ?? "",
    });
  }

  if (section.is_entity_extra) {
    if (!pageKey || !entityId) {
      throw new Error("Missing page or entity for page-only section");
    }
    return upsertEntityPageSection({
      id: section.entity_override_id || undefined,
      page_key: pageKey,
      entity_id: entityId,
      section_key: sectionKey,
      section_theme,
    });
  }

  const tagId = section.page_tag_id;
  if (!tagId) throw new Error("Missing page placement tag");

  // Template scope + template CMS: tag only. Page scope on template CMS: tag default.
  if (!entityId || scope === "template") {
    return updatePageSectionTag(tagId, { section_theme });
  }

  // Page scope on entity CMS: per-entity override (does not touch `data`).
  return upsertEntityPageSection({
    id: section.entity_override_id || undefined,
    page_key: pageKey,
    entity_id: entityId,
    section_key: sectionKey,
    page_tag_id: tagId,
    section_theme,
  });
}

/** Invoke savePlacement whether it expects (section, patch) or (patch) only. */
function invokeSavePlacement(savePlacement, section, patch) {
  if (savePlacement.length >= 2) {
    return savePlacement(section, patch);
  }
  return savePlacement(patch);
}

/** Save band background + theme on the placement layer (theme is page-level only). */
export async function saveSectionBandForPlacement(
  section,
  { draft, savePlacement, contentLocked = false, pageKey, entityId }
) {
  if (!contentLocked) {
    await invokeSavePlacement(savePlacement, section, {
      section_bg_img: draft.bgImg?.trim() || null,
      section_bg_color: draft.bgColor?.trim() || null,
    });
  }
  if (
    sectionSupportsBandTheme(section?.section_key, section?.render_key)
  ) {
    await saveSectionThemeForPlacement(section, {
      pageKey,
      entityId,
      rawValue: draft.theme ?? "inherit",
    });
  }
}
