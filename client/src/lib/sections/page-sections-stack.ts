import type { PlacementLike } from "./section-types";
import { shouldRenderPlacement } from "./item-types";
import { computePlacementSurface } from "./section-theme";

export function placementKey(section: PlacementLike | null | undefined): string {
  return String(
    section?.placement_id ||
      section?.page_tag_id ||
      section?.entity_override_id ||
      ""
  );
}

export function normalizeInitialSections(sections: unknown[] | PlacementLike[] = []) {
  return (sections || []).map((s) => {
    const row = (s || {}) as PlacementLike;
    return {
      ...row,
      placement_id:
        row.placement_id ||
        (row.page_tag_id
          ? String(row.page_tag_id)
          : String(
              (row.sources as Record<string, unknown> | undefined)
                ?.entity_page_section_id || ""
            )),
      is_entity_extra: Boolean(row.is_entity_extra),
    };
  });
}

export function buildVisibleWithSurface<T extends PlacementLike = PlacementLike>(
  sections: T[] = [],
  pageTheme: unknown,
  cmsMode = false
) {
  const visible = (sections || []).filter((s) =>
    shouldRenderPlacement(s, cmsMode)
  );
  const altIndex = { current: 0 };
  return visible.map((section) => ({
    section,
    ...computePlacementSurface(section, {
      pageTheme,
      altIndex,
    }),
  }));
}
