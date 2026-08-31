/**
 * Single row in SECTION_CATALOG — defaults keep new sections to one object.
 */
import type {
  ContentScope,
  SectionCatalogEntry,
  SectionSurfaceMode,
} from "../section-types";

export function defineCatalogEntry({
  key,
  name,
  category,
  tags = [] as string[],
  surface = "alt" as SectionSurfaceMode,
  usesSectionImage = false,
  contentScope,
  renderKey,
}: {
  key: string;
  name: string;
  category: string;
  tags?: string[];
  surface?: SectionSurfaceMode;
  usesSectionImage?: boolean;
  contentScope?: ContentScope;
  renderKey?: string;
}): SectionCatalogEntry {
  const entry: SectionCatalogEntry = {
    key,
    name,
    category,
    tags,
    surface,
    uses_section_image: usesSectionImage,
  };
  if (contentScope) entry.content_scope = contentScope;
  if (renderKey) entry.render_key = renderKey;
  return entry;
}
