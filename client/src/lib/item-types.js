/** Keep in sync with server/src/modules/cms/item.schema.js */

import {
  sectionUsesItems,
} from "@/lib/section-items-config";
import { isRichTextEmpty } from "@/lib/rich-text";

/** Active items sorted by sort_order (must have some visible content) */
export function sortActiveItems(items) {
  if (!Array.isArray(items)) return [];
  return [...items]
    .filter((item) => {
      if (!item || item.status === false) return false;
      return Boolean(
        item.title ||
          item.subtitle ||
          !isRichTextEmpty(item.body) ||
          item.label ||
          item.value ||
          item.image_url ||
          item.bg_color ||
          item.icon ||
          item.href ||
          (Array.isArray(item.buttons) && item.buttons.length)
      );
    })
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/**
 * Mapping `items[]` only — no legacy data.items / data.modules fallback.
 * Items live on EntityPageSection, never page tags or Section.data.
 */
export function resolveSectionItems(items) {
  return sortActiveItems(Array.isArray(items) ? items : []);
}

/** Resolve items for a placement (sectionKey kept for callers / future filters) */
export function resolveItemsForSection(_sectionKey, items) {
  return resolveSectionItems(items);
}

/**
 * Item-driven sections are meaningless without items.
 * Returns false when the public page (cms !== true) should hide the whole section.
 */
export function placementHasRequiredItems(section) {
  if (!sectionUsesItems(section?.section_key)) return true;
  return resolveItemsForSection(section.section_key, section?.items).length > 0;
}

function hasActiveButtons(section) {
  const buttons = section?.buttons;
  if (Array.isArray(buttons)) {
    const live = buttons.some(
      (b) =>
        b &&
        b.status !== false &&
        Boolean(
          String(b.title || b.label || "").trim() ||
            String(b.href || b.target_url || b.url || "").trim()
        )
    );
    if (live) return true;
  }
  return Boolean(
    String(section?.button_title || "").trim() ||
      String(section?.target_url || "").trim()
  );
}

/**
 * Field-driven sections (overview, most heroes…): need at least one display field.
 * Title / subtitle / body / image / bg / CTA.
 */
export function placementHasFieldContent(section) {
  if (!section) return false;
  return Boolean(
    String(section.section_title || "").trim() ||
      String(section.sub_title || "").trim() ||
      !isRichTextEmpty(section?.data?.body) ||
      String(section.section_img_url || "").trim() ||
      String(section.section_bg_img || "").trim() ||
      String(section.section_bg_color || "").trim() ||
      String(section.data?.bg_color || "").trim() ||
      hasActiveButtons(section)
  );
}

/**
 * Context-backed sections always have runtime UI (catalog grid, products fetch…).
 * In-page nav builds from other visible sections — keep it if enabled.
 */
const CONTEXT_BACKED_SECTION_KEYS = new Set([
  "in_page_nav",
  "catalog",
  "entity_directory",
  "latest_blogs",
  "blog_directory",
  "products",
  "related_courses",
]);

/**
 * True when this placement has something real to show on a public page.
 * - Item sections → active items
 * - Field sections → title / body / media / buttons
 * - Context sections → always (when status is on)
 */
export function placementHasMeaningfulContent(section) {
  if (!section) return false;
  const key = String(section.section_key || "").toLowerCase();

  if (CONTEXT_BACKED_SECTION_KEYS.has(key)) return true;

  if (sectionUsesItems(key)) {
    const hasItems =
      resolveItemsForSection(key, section.items).length > 0;
    // Hero stats can be useful with copy alone (items optional in the UI)
    if (key === "hero_stats") {
      return hasItems || placementHasFieldContent(section);
    }
    return hasItems;
  }

  return placementHasFieldContent(section);
}

/**
 * Live pages: hide placements that have nothing to show.
 * CMS mode always shows shells so editors can fill empty sections.
 * Drives both section display and in-page nav (nav reads the filtered list).
 */
export function shouldRenderPlacement(section, cmsMode = false) {
  if (!section) return false;
  if (section.status === false) return false;
  if (cmsMode) return true;
  return placementHasMeaningfulContent(section);
}

/**
 * Build a probe object from section component props (for per-UI empty checks).
 */
export function sectionProbeFromProps(sectionKey, props = {}) {
  return {
    section_key: sectionKey,
    section_title: props.section_title,
    sub_title: props.sub_title,
    data: props.data,
    section_img_url: props.section_img_url,
    section_bg_img: props.section_bg_img,
    section_bg_color: props.section_bg_color,
    buttons: props.buttons,
    button_title: props.button_title,
    target_url: props.target_url,
    items: props.items,
  };
}

/** FAQ: title/body (or legacy q/a) */
export function itemQuestion(item) {
  return item?.title || item?.q || item?.question || "";
}

export function itemAnswer(item) {
  return item?.body || item?.a || item?.answer || "";
}

/** Testimonial helpers */
export function itemQuote(item) {
  return item?.body || item?.quote || item?.text || "";
}

export function itemAuthor(item) {
  return item?.title || item?.label || item?.author || "";
}

/** Stat helpers */
export function itemStatValue(item) {
  return item?.value || "";
}

export function itemStatLabel(item) {
  return item?.label || item?.title || "";
}

/** Benefit / card title */
export function itemTitle(item) {
  if (typeof item === "string") return item;
  return item?.title || item?.label || "";
}
