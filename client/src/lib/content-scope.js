/**
 * Section content_scope — where content may be edited / resolved from.
 *
 *  - global   → Section catalog only (locked on template + entity pages)
 *  - template → Section + page-tag (locked on entity pages)
 *  - page     → Section + tag + entity (full cascade)
 *
 * Legacy DB value "cascading" maps to "page".
 */

export const CONTENT_SCOPES = ["global", "template", "page"];

export function normalizeContentScope(scope) {
  const s = String(scope || "").toLowerCase();
  if (s === "global") return "global";
  if (s === "template") return "template";
  // "cascading" (legacy) and "page"
  return "page";
}

/** True when content pencils should be locked on this CMS layer */
export function contentLockedAtLayer(scope, layer) {
  const s = normalizeContentScope(scope);
  if (s === "global") return true;
  if (s === "template" && layer === "page") return true;
  return false;
}

export function contentScopeLabel(scope) {
  const s = normalizeContentScope(scope);
  if (s === "global") return "Global";
  if (s === "template") return "Template";
  return "Page";
}

export function lockedContentMessage(scope, layer) {
  const s = normalizeContentScope(scope);
  if (s === "global") {
    return "This section uses global content. Edit it once under Content sections — template and page editors are locked.";
  }
  if (s === "template" && layer === "page") {
    return "This section is locked to template content. Edit it on the page template placement — not on this entity page.";
  }
  return "Content is locked at this layer.";
}

export function lockedContentHref(scope, { sectionKey, pageKey, tagId } = {}) {
  const s = normalizeContentScope(scope);
  if (s === "global" && sectionKey) {
    return `/cms/pages-content-sections/${sectionKey}`;
  }
  if (s === "template" && pageKey && tagId) {
    return `/cms/pages/${pageKey}/placements/${tagId}`;
  }
  if (sectionKey) return `/cms/pages-content-sections/${sectionKey}`;
  return "/cms/pages-content-sections";
}
