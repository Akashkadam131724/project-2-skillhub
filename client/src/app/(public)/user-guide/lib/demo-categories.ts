import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
} from "@/lib/sections/section-registry";

export function getDemoCategoryKeys() {
  return SECTION_CATEGORIES.map((category) => category.key);
}

export function getDemoCategoryNav() {
  return SECTION_CATEGORIES.filter((category) =>
    SECTION_CATALOG.some((section) => section.category === category.key)
  ).map((category) => ({
    key: category.key,
    name: category.name,
  }));
}

export function getDemoCategory(categoryKey: string) {
  const normalized = String(categoryKey || "").toLowerCase();
  const category = SECTION_CATEGORIES.find((item) => item.key === normalized);
  if (!category) return null;

  const sections = SECTION_CATALOG.filter(
    (section) => section.category === normalized
  );
  if (!sections.length) return null;

  return { category, sections };
}
