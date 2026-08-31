import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";

export type PlacementGuardOptions = {
  /** When false, only checks for showable items (no catalog probe). Default true. */
  placementProbe?: boolean;
};

/**
 * Factory for per-section `isXPlacementShowable(props, cmsMode)` helpers.
 */
export function createPlacementGuard<
  T extends { section_key?: string; items?: unknown },
>(
  defaultKey: string,
  isItemShowable: (item: unknown) => boolean,
  { placementProbe = true }: PlacementGuardOptions = {}
) {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (
      placementProbe &&
      !shouldRenderPlacement(
        sectionProbeFromProps(
          props.section_key || defaultKey,
          props as Record<string, unknown>
        ),
        false
      )
    ) {
      return false;
    }
    const items = Array.isArray(props.items) ? props.items : [];
    return items.some(isItemShowable);
  };
}

/** Title, subtitle, optional body, or showable items — no catalog probe. */
export function createHeaderOrItemsPlacementGuard<
  T extends {
    section_title?: string;
    sub_title?: string;
    data?: { body?: string; [key: string]: unknown };
    items?: unknown;
  },
>(
  isItemShowable: (item: unknown) => boolean,
  { probeBody = true }: { probeBody?: boolean } = {}
) {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (String(props.section_title || "").trim()) return true;
    if (String(props.sub_title || "").trim()) return true;
    if (probeBody && !isRichTextEmpty(props.data?.body)) return true;
    const items = Array.isArray(props.items) ? props.items : [];
    return items.some(isItemShowable);
  };
}

/** Title, subtitle, or rich body — no items. */
export function createContentPlacementGuard<
  T extends {
    section_title?: string;
    sub_title?: string;
    data?: { body?: string; [key: string]: unknown };
  },
>() {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (String(props.section_title || "").trim()) return true;
    if (String(props.sub_title || "").trim()) return true;
    return !isRichTextEmpty(props.data?.body);
  };
}

/** Catalog probe only — for header/media sections without item lists. */
export function createProbePlacementGuard<
  T extends { section_key?: string },
>(defaultKey: string) {
  return function isPlacementShowable(
    props: T,
    cmsMode = false
  ): boolean {
    if (cmsMode) return true;
    return shouldRenderPlacement(
      sectionProbeFromProps(
        props.section_key || defaultKey,
        props as Record<string, unknown>
      ),
      false
    );
  };
}

/** Title, subtitle, or active section buttons. */
export function createTitleSubtitleButtonsPlacementGuard<
  T extends {
    section_title?: string;
    sub_title?: string;
    buttons?: unknown;
    button_title?: string;
    target_url?: string;
  },
>() {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (String(props.section_title || "").trim()) return true;
    if (String(props.sub_title || "").trim()) return true;
    const list = sortActiveButtons(
      Array.isArray(props.buttons) && props.buttons.length
        ? props.buttons
        : buttonsFromLegacy(props.button_title, props.target_url)
    );
    return list.length > 0;
  };
}

/** Title, subtitle, hero image, or buttons — split CTA bands. */
export function createSplitCtaPlacementGuard<
  T extends {
    section_title?: string;
    sub_title?: string;
    section_img_url?: string;
    data?: { image_url?: string; [key: string]: unknown };
    buttons?: unknown;
    button_title?: string;
    target_url?: string;
  },
>() {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (String(props.section_title || "").trim()) return true;
    if (String(props.sub_title || "").trim()) return true;
    if (String(props.section_img_url || props.data?.image_url || "").trim()) {
      return true;
    }
    if (String(props.button_title || props.target_url || "").trim()) {
      return true;
    }
    const buttons = Array.isArray(props.buttons) ? props.buttons : [];
    return buttons.length > 0;
  };
}

/** Title, subtitle, body, or buttons — overlays / modals. */
export function createContentOrButtonsPlacementGuard<
  T extends {
    section_title?: string;
    sub_title?: string;
    data?: { body?: string; [key: string]: unknown };
    buttons?: unknown;
    button_title?: string;
    target_url?: string;
  },
>() {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (String(props.section_title || "").trim()) return true;
    if (String(props.sub_title || "").trim()) return true;
    if (!isRichTextEmpty(props.data?.body)) return true;
    const list = sortActiveButtons(
      Array.isArray(props.buttons) && props.buttons.length
        ? props.buttons
        : buttonsFromLegacy(props.button_title, props.target_url)
    );
    return list.length > 0;
  };
}

/** Always render on public pages (client handles empty state). */
export function createAlwaysShowPlacementGuard<T>() {
  return function isPlacementShowable(_props: T, cmsMode = false): boolean {
    return cmsMode || true;
  };
}

/** Page-context catalog sections (related courses, etc.). */
export function createPageContextPlacementGuard<
  T extends { pageContext?: unknown },
>(hasContext: (pageContext: T["pageContext"]) => boolean) {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    return hasContext(props.pageContext);
  };
}

/** Nav / list sections with a minimum built item count. */
export function createMinBuiltItemsPlacementGuard<T>(
  buildItems: (props: T) => unknown[],
  minCount = 2
) {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    return buildItems(props).length >= minCount;
  };
}

export type StaticFallbackItemsGuardOptions<T> = {
  probeBody?: boolean;
  hasButtons?: (props: T) => boolean;
  hasMedia?: (props: T) => boolean;
  isItemShowable?: (item: unknown) => boolean;
};

/** Title, body, buttons, media, items, or static demo fallback list. */
export function createStaticFallbackItemsGuard<
  T extends {
    section_title?: string;
    sub_title?: string;
    data?: { body?: string; [key: string]: unknown };
    items?: unknown;
  },
>(
  resolveItems: (
    items: unknown[] | undefined,
    options: { fallbackStatic: boolean }
  ) => unknown[],
  {
    probeBody = true,
    hasButtons,
    hasMedia,
    isItemShowable,
  }: StaticFallbackItemsGuardOptions<T> = {}
) {
  return function isPlacementShowable(props: T, cmsMode = false): boolean {
    if (cmsMode) return true;
    if (String(props.section_title || "").trim()) return true;
    if (String(props.sub_title || "").trim()) return true;
    if (hasMedia?.(props)) return true;
    if (probeBody && !isRichTextEmpty(props.data?.body)) return true;
    if (hasButtons?.(props)) return true;
    const items = Array.isArray(props.items) ? props.items : [];
    if (isItemShowable && items.some(isItemShowable)) return true;
    return resolveItems(
      Array.isArray(props.items) ? props.items : undefined,
      { fallbackStatic: true }
    ).length > 0;
  };
}
