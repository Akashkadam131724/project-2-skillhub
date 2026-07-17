/** Keep in sync with server/src/modules/cms/item.schema.js */

import {
  sectionUsesItems,
} from "@/lib/section-items-config";
import { isRichTextEmpty } from "@/lib/rich-text";

function itemId(item) {
  return String(item?._id || item?.id || "").trim();
}

function itemHasVisibleContent(item) {
  if (!item) return false;
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
      (Array.isArray(item.buttons) && item.buttons.length) ||
      // Tabs can exist as shells that only group children
      String(item.item_type || "").toLowerCase() === "tab"
  );
}

/** True when this row is a nested child of a tab (or other parent). */
export function isChildItem(item) {
  if (!item || item.status === false) return false;
  const type = String(item.item_type || "").toLowerCase();
  if (type === "tab") return false;
  return Boolean(String(item.parent_id || "").trim());
}

/** True when this row is a top-level tab / legacy item. */
export function isTabItem(item) {
  if (!item || item.status === false) return false;
  if (isChildItem(item)) return false;
  const type = String(item.item_type || "").toLowerCase();
  // Explicit tab, or legacy top-level row (no item_type / no parent)
  return type === "tab" || type === "";
}

/** Active items sorted by sort_order (must have some visible content) */
export function sortActiveItems(items) {
  if (!Array.isArray(items)) return [];
  return [...items]
    .filter((item) => {
      if (!item || item.status === false) return false;
      return itemHasVisibleContent(item);
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

/**
 * Group flat items into tabs with children.
 * Legacy rows (no item_type / parent_id) become tabs with empty children.
 */
export function groupItemsByTabs(items) {
  const all = resolveSectionItems(items);
  const tabs = all.filter((item) => isTabItem(item));
  const children = all.filter((item) => isChildItem(item));

  return tabs.map((tab) => {
    const id = itemId(tab);
    return {
      ...tab,
      children: children
        .filter((child) => String(child.parent_id || "").trim() === id)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    };
  });
}

/** Section keys that use flat tab → child nesting via item_type + parent_id */
export const NESTED_TABS_SECTION_KEYS = new Set([
  "feature_tabs",
  "tabs_vertical",
  "tabs_horizontal",
  "tabs_underline",
]);

/** Resolve items for a placement — nested children hidden unless section wants them */
export function resolveItemsForSection(sectionKey, items) {
  const active = resolveSectionItems(items);
  const key = String(sectionKey || "").toLowerCase();

  // Nested tab sections: return tab shells only (children via groupItemsByTabs)
  if (NESTED_TABS_SECTION_KEYS.has(key)) {
    return active.filter((item) => isTabItem(item));
  }

  // Other sections: ignore nested children so they don't leak into grids
  return active.filter((item) => !isChildItem(item));
}

/**
 * Item-driven sections are meaningless without items.
 * Returns false when the public page (cms !== true) should hide the whole section.
 */
export function placementHasRequiredItems(section) {
  if (!sectionUsesItems(section?.section_key, section?.render_key)) return true;
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

  if (sectionUsesItems(key, section.render_key)) {
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
