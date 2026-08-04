/**
 * Public resolved-section shaping — filter empties + strip CMS-only fields.
 * Used when GET /pages/:key/sections?view=public (or public=1).
 */

const CONTEXT_BACKED_KEYS = new Set([
  "in_page_nav",
  "catalog",
  "entity_directory",
  "latest_blogs",
  "blog_directory",
  "products",
  "related_courses",
]);

function isRichTextEmpty(html) {
  if (html == null) return true;
  const text = String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return !text;
}

function itemHasContent(item) {
  if (!item || item.status === false) return false;
  return Boolean(
    String(item.title || "").trim() ||
      String(item.subtitle || "").trim() ||
      !isRichTextEmpty(item.body) ||
      String(item.label || "").trim() ||
      String(item.value || "").trim() ||
      String(item.image_url || "").trim() ||
      String(item.bg_color || "").trim() ||
      String(item.icon || "").trim() ||
      String(item.href || "").trim() ||
      (Array.isArray(item.buttons) &&
        item.buttons.some(
          (b) =>
            b &&
            b.status !== false &&
            (String(b.label || b.title || "").trim() ||
              String(b.target_url || b.href || "").trim())
        )) ||
      String(item.item_type || "").toLowerCase() === "tab"
  );
}

function activeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter(itemHasContent)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function activeButtons(buttons) {
  if (!Array.isArray(buttons)) return [];
  return buttons.filter(
    (b) =>
      b &&
      b.status !== false &&
      (String(b.label || b.title || "").trim() ||
        String(b.target_url || b.href || b.url || "").trim())
  );
}

function hasActiveButtons(section) {
  if (activeButtons(section?.buttons).length) return true;
  return Boolean(
    String(section?.button_title || "").trim() ||
      String(section?.target_url || "").trim()
  );
}

function hasFieldContent(section) {
  return Boolean(
    String(section?.section_title || "").trim() ||
      String(section?.sub_title || "").trim() ||
      !isRichTextEmpty(section?.data?.body) ||
      String(section?.section_img_url || "").trim() ||
      hasActiveButtons(section)
  );
}

/**
 * True when this placement should ship to the public site.
 * Mirrors client placementHasMeaningfulContent (cmsMode=false).
 */
export function placementHasPublicContent(section) {
  if (!section) return false;
  const key = String(section.section_key || "").toLowerCase();

  if (CONTEXT_BACKED_KEYS.has(key)) return true;

  const items = activeItems(section.items);
  if (items.length) return true;

  return hasFieldContent(section);
}

/** Slim placement for public JSON — no CMS status/sources/ids noise. */
export function toPublicSectionPayload(section) {
  const items = activeItems(section.items);
  const buttons = activeButtons(section.buttons);

  return {
    section_key: section.section_key,
    render_key: section.render_key || "",
    placement_id: section.placement_id || null,
    page_tag_id: section.page_tag_id || null,
    is_entity_extra: Boolean(section.is_entity_extra),
    content_scope: section.content_scope || "page",
    sort_order: section.sort_order ?? 0,
    section_title: section.section_title || "",
    sub_title: section.sub_title || "",
    in_page_nav_title: section.in_page_nav_title || "",
    section_bg_img: section.section_bg_img || "",
    section_bg_color: section.section_bg_color || "",
    section_img_url: section.section_img_url || "",
    section_theme: section.section_theme || "",
    data: section.data && typeof section.data === "object" ? section.data : {},
    buttons,
    items,
    ...(String(section.button_title || "").trim()
      ? { button_title: section.button_title }
      : {}),
    ...(String(section.target_url || "").trim()
      ? { target_url: section.target_url }
      : {}),
  };
}

export function toPublicPagePayload(page) {
  if (!page) return null;
  return {
    key: page.key,
    name: page.name,
    entity_type: page.entity_type,
    theme: page.theme || null,
  };
}

export function shapeResolvedForPublic(result) {
  if (!result || result.error) return result;
  const sections = (result.sections || [])
    .filter(placementHasPublicContent)
    .map(toPublicSectionPayload);

  return {
    page: toPublicPagePayload(result.page),
    entity_id: result.entity_id || null,
    sections,
    meta: {
      visible: sections.length,
    },
  };
}

export function isPublicViewRequest(query = {}) {
  const view = String(query.view || "").toLowerCase();
  if (view === "public") return true;
  const flag = query.public;
  return flag === true || flag === "1" || flag === "true";
}
