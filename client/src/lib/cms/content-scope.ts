/**
 * Section content_scope — where content may be edited / resolved from.
 *
 *  - global   → Section catalog only (locked on template + entity pages)
 *  - template → Section + page-tag (locked on entity pages)
 *  - page     → Section + tag + entity (full cascade)
 *
 * Legacy DB value "cascading" maps to "page".
 */

import { SECTION_CATALOG } from "@/lib/sections/section-registry";

export const CONTENT_SCOPES = ["global", "template", "page"] as const;

export type ContentScope = "global" | "template" | "page";

export type ContentScopeLayer = "global" | "template" | "page";

export function normalizeContentScope(scope?: unknown): ContentScope {
  const s = String(scope || "").toLowerCase();
  if (s === "global") return "global";
  if (s === "template") return "template";
  return "page";
}

/** Client catalog hint when API/DB scope is missing or stale. */
export function catalogContentScopeHint(sectionKey?: string): ContentScope | null {
  const key = String(sectionKey || "").toLowerCase();
  if (!key) return null;
  const entry = SECTION_CATALOG.find((s) => s.key === key) as
    | { content_scope?: unknown }
    | undefined;
  if (!entry?.content_scope) return null;
  return normalizeContentScope(entry.content_scope);
}

/**
 * Resolve scope for a live placement: explicit value → API catalog → client hint.
 */
export function resolveContentScope({
  scope,
  sectionKey,
  catalogSection,
}: {
  scope?: unknown;
  sectionKey?: string;
  catalogSection?: { content_scope?: unknown };
} = {}): ContentScope {
  const fromExplicit = String(scope || "").toLowerCase().trim();
  if (fromExplicit === "global" || fromExplicit === "template") {
    return fromExplicit;
  }
  if (fromExplicit === "page" || fromExplicit === "cascading") {
    const fromCatalog = normalizeContentScope(catalogSection?.content_scope);
    if (fromCatalog === "global" || fromCatalog === "template") {
      return fromCatalog;
    }
    const hint = catalogContentScopeHint(sectionKey);
    if (hint === "global" || hint === "template") return hint;
    return "page";
  }
  const fromCatalog = normalizeContentScope(catalogSection?.content_scope);
  if (fromCatalog === "global" || fromCatalog === "template") {
    return fromCatalog;
  }
  const hint = catalogContentScopeHint(sectionKey);
  if (hint) return hint;
  return "page";
}

/** Live entity / home editors always check locks at the page layer. */
export function liveEditContentLayer(): ContentScopeLayer {
  return "page";
}

/** True when content pencils should be locked on this CMS layer */
export function contentLockedAtLayer(scope: unknown, layer: ContentScopeLayer) {
  const s = normalizeContentScope(scope);
  if (s === "global") return true;
  if (s === "template" && layer === "page") return true;
  return false;
}

export function contentScopeLabel(scope: unknown) {
  const s = normalizeContentScope(scope);
  if (s === "global") return "Global";
  if (s === "template") return "Template";
  return "Page";
}

export function lockedContentMessage(scope: unknown, layer: ContentScopeLayer) {
  const s = normalizeContentScope(scope);
  if (s === "global") {
    return "This section uses global content. Edit it once under Content sections — template and page editors are locked.";
  }
  if (s === "template" && layer === "page") {
    return "This section is locked to template content. Edit it on the page template placement — not on this entity page.";
  }
  return "Content is locked at this layer.";
}

export function lockedContentHref(
  scope: unknown,
  {
    sectionKey,
    pageKey,
    tagId,
  }: { sectionKey?: string; pageKey?: string; tagId?: string } = {}
) {
  const s = normalizeContentScope(scope);
  if (s === "global" && sectionKey) {
    return `/cms/pages-content-sections/${sectionKey}`;
  }
  if (s === "template" && pageKey) {
    if (tagId) return `/cms/pages/${pageKey}/placements/${tagId}`;
    return `/cms/pages/${pageKey}`;
  }
  if (sectionKey) return `/cms/pages-content-sections/${sectionKey}`;
  return "/cms/pages-content-sections";
}

/** Fields that may still be written on a locked placement (visibility / order only). */
export const LOCKED_PLACEMENT_ALLOWED_KEYS = new Set(["status", "sort_order"]);

export function filterLockedPlacementPatch(
  section: { content_scope?: unknown } | null | undefined,
  patch: Record<string, unknown> | null | undefined,
  layer: ContentScopeLayer = "page"
) {
  if (!contentLockedAtLayer(section?.content_scope, layer)) return patch;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch || {})) {
    if (LOCKED_PLACEMENT_ALLOWED_KEYS.has(key)) next[key] = value;
  }
  return next;
}
