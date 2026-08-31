/** Shared section catalog / placement types for lib/sections. */

export type SectionSurfaceMode = "alt" | "fixed";

export type ContentScope = "global" | "template" | "page";

export type SectionCatalogEntry = {
  key: string;
  name: string;
  category: string;
  tags: string[];
  surface: SectionSurfaceMode;
  uses_section_image: boolean;
  content_scope?: ContentScope;
  render_key?: string;
};

/**
 * Loose placement row — CMS tags, entity overrides, and public section props.
 * Intentionally permissive so PagePlacement and API payloads assign without casts.
 */
export type PlacementLike = Record<string, unknown>;
