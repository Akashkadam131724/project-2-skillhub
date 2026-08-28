import type { InPageNavItem, NavSectionRecord } from "./types";

export function navLabel(section: NavSectionRecord | null | undefined): string | null {
  if (!section || section.section_key === "in_page_nav") return null;
  const title = String(section.in_page_nav_title || "").trim();
  if (title) return title;
  const fallback = String(section.section_title || "").trim();
  return fallback || null;
}

export function buildInPageNavItems(
  sections: NavSectionRecord[] = []
): InPageNavItem[] {
  return sections
    .map((section) => {
      const label = navLabel(section);
      if (!label) return null;
      const id =
        section.placement_id ||
        section.page_tag_id ||
        section.entity_override_id;
      if (!id) return null;
      return {
        id: String(id),
        label,
        targetId: `cms-section-${id}`,
      };
    })
    .filter((item): item is InPageNavItem => item != null);
}
