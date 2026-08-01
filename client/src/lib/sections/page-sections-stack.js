import { shouldRenderPlacement } from "./item-types";
import { computePlacementSurface } from "./section-theme";

export function placementKey(section) {
  return (
    section?.placement_id ||
    section?.page_tag_id ||
    section?.entity_override_id
  );
}

export function normalizeInitialSections(sections = []) {
  return (sections || []).map((s) => ({
    ...s,
    placement_id:
      s.placement_id ||
      (s.page_tag_id
        ? String(s.page_tag_id)
        : String(s.sources?.entity_page_section_id || "")),
    is_entity_extra: Boolean(s.is_entity_extra),
  }));
}

export function buildVisibleWithSurface(sections, pageTheme, cmsMode = false) {
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
