import { normalizeContentScope } from "@/lib/cms/content-scope";
import { normalizeSectionTheme, sectionSupportsBandTheme } from "./section-theme";
import {
  updatePageSectionTag,
  updateSection,
  upsertEntityPageSection,
} from "@/lib/api/cms-api";
import type { PlacementLike } from "./section-types";

export type SavePlacementFn = (
  sectionOrPatch: PlacementLike | Record<string, unknown>,
  patch?: Record<string, unknown>
) => Promise<unknown>;

/** DB value for top-level `section_theme` (null/"" = inherit). */
export function sectionThemeDbValue(raw: unknown) {
  const theme = normalizeSectionTheme({ section_theme: raw });
  return theme === "inherit" ? null : theme;
}

/**
 * Save section theme on the correct layer — Section catalog, page tag, or entity
 * placement. Never writes `data.section_theme`.
 */
export async function saveSectionThemeForPlacement(
  section: PlacementLike,
  {
    pageKey,
    entityId,
    rawValue,
  }: {
    pageKey?: string;
    entityId?: string | number;
    rawValue?: unknown;
  }
) {
  const section_theme = sectionThemeDbValue(rawValue);
  const scope = normalizeContentScope(section.content_scope);
  const sectionKey = section.section_key;

  if (scope === "global") {
    if (!sectionKey) throw new Error("Missing section key");
    return updateSection(String(sectionKey), {
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
    return updatePageSectionTag(String(tagId), { section_theme });
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
function invokeSavePlacement(
  savePlacement: SavePlacementFn,
  section: PlacementLike,
  patch: Record<string, unknown>
) {
  if (savePlacement.length >= 2) {
    return savePlacement(section, patch);
  }
  return savePlacement(patch);
}

/** Save band background + theme. Prefers one write on entity page placements. */
export async function saveSectionBandForPlacement(
  section: PlacementLike,
  {
    draft,
    savePlacement,
    contentLocked = false,
    pageKey,
    entityId,
  }: {
    draft: {
      theme?: unknown;
      bgImg?: string;
      bgColor?: string;
    };
    savePlacement: SavePlacementFn;
    contentLocked?: boolean;
    pageKey?: string;
    entityId?: string | number;
  }
) {
  const supportsTheme = sectionSupportsBandTheme(
    section?.section_key != null ? String(section.section_key) : undefined,
    section?.render_key != null ? String(section.render_key) : undefined
  );
  const themeDb = supportsTheme
    ? sectionThemeDbValue(draft.theme ?? "inherit")
    : undefined;

  const bgPatch: Record<string, unknown> = contentLocked
    ? {}
    : {
        section_bg_img: draft.bgImg?.trim() || null,
        section_bg_color: draft.bgColor?.trim() || null,
      };

  const scope = normalizeContentScope(section.content_scope);
  const canSingleEntityWrite =
    Boolean(entityId) &&
    (section.is_entity_extra || scope === "page");

  if (canSingleEntityWrite) {
    const patch: Record<string, unknown> = { ...bgPatch };
    if (supportsTheme) patch.section_theme = themeDb;
    if (Object.keys(patch).length) {
      await invokeSavePlacement(savePlacement, section, patch);
    }
    return {
      localPatch: {
        ...bgPatch,
        ...(supportsTheme
          ? {
              section_theme: themeDb || "",
              section_theme_local: themeDb,
            }
          : {}),
      },
    };
  }

  if (!contentLocked && Object.keys(bgPatch).length) {
    await invokeSavePlacement(savePlacement, section, bgPatch);
  }
  if (supportsTheme) {
    await saveSectionThemeForPlacement(section, {
      pageKey,
      entityId,
      rawValue: draft.theme ?? "inherit",
    });
  }

  return {
    localPatch: {
      ...bgPatch,
      ...(supportsTheme
        ? {
            section_theme: themeDb || "",
            section_theme_local: themeDb,
          }
        : {}),
    },
  };
}
