import type { ReactNode } from "react";
import type { ButtonDraft, SectionItemDraft } from "@/components/cms/editors/types";

import type { PlacementLike } from "@/lib/sections/section-types";

/** Merged page placement from template tags + entity overrides. */
export type PagePlacement = {
  placement_id: string;
  page_tag_id?: string | number | null;
  is_entity_extra: boolean;
  section_key: string;
  render_key?: string;
  section_id?: string | number | null;
  name?: string;
  content_scope?: string;
  sort_order?: number;
  section_title?: string;
  sub_title?: string;
  in_page_nav_title?: string;
  section_bg_img?: string;
  section_bg_color?: string;
  section_img_url?: string;
  section_theme?: string;
  section_theme_local?: string | null;
  section_preview_img?: string;
  buttons?: ButtonDraft[];
  items?: SectionItemDraft[];
  data?: Record<string, unknown>;
  status?: boolean;
  entity_override_id?: string | number | null;
  entity_id?: string | number | null;
  [key: string]: unknown;
};

export type SectionCatalogEntry = {
  _id?: string;
  id?: string;
  key: string;
  name?: string;
  status?: boolean;
  content_scope?: string;
  section_title?: string;
  section_preview_img?: string;
  [key: string]: unknown;
};

export type PlacementWithSurface = {
  section: PagePlacement | PlacementLike;
  surfaceTone?: string | null;
  surfaceBand?: unknown;
  surfaceBandIndex?: number;
  sectionTheme?: string;
};

export type FieldMetaKey =
  | "section_title"
  | "sub_title"
  | "in_page_nav_title"
  | "section_img_url"
  | "body"
  | "buttons"
  | "items"
  | "faq_header_side"
  | "cta_image_side"
  | "form_content_side"
  | "section_band";

export type FieldMetaOption = {
  value: string;
  label: string;
};

export type FieldMeta = {
  label: string;
  input: string;
  hint?: string;
  options?: FieldMetaOption[];
};

export type FieldEditOptions = {
  preset?: "left" | "right";
  expandItemButtons?: boolean;
  [key: string]: unknown;
};

export type FieldEditState = {
  section: PagePlacement;
  field: FieldMetaKey | string;
} & FieldEditOptions;

export type FieldSavedResult = {
  localPatch?: Partial<PagePlacement>;
};

export type CmsLiveEditProviderProps = {
  pageKey: string;
  entityId: string | number;
  entityLabel?: string | null;
  publicHref?: string | null;
  pageContext?: Record<string, unknown> | null;
  initialTheme?: Record<string, unknown> | null;
  children: ReactNode;
};

export type CmsLiveEditContextValue = {
  pageKey: string;
  entityId: string | number;
  entityLabel: string | null;
  publicHref: string | null;
  pageContext: Record<string, unknown> | null;
  pageTheme: Record<string, unknown>;
  setPageTheme: (next: Record<string, unknown>) => void;
};

export type CmsLivePlacementsContextValue = {
  sections: PagePlacement[];
  setSections: React.Dispatch<React.SetStateAction<PagePlacement[]>>;
  catalog: SectionCatalogEntry[];
  catalogLoading: boolean;
  ensureCatalog: () => Promise<SectionCatalogEntry[]>;
  sortDisabled: boolean;
  loading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
  reload: () => Promise<PagePlacement[]>;
  savePlacement: (
    section: PagePlacement | PlacementLike | Record<string, unknown>,
    patch: Record<string, unknown>
  ) => Promise<unknown>;
  move: (index: number, dir: number) => Promise<void>;
  toggleVisibility: (section: PagePlacement | Record<string, unknown>) => Promise<void>;
  addOnThisPage: (sectionKey: string) => Promise<void>;
  removeExtra: (section?: PagePlacement | Record<string, unknown>) => Promise<void>;
  visibleWithSurface: PlacementWithSurface[];
  editing: FieldEditState | null;
  fieldDrawerOpen: boolean;
  openFieldEdit: (
    section: PagePlacement | Record<string, unknown>,
    field: string,
    options?: FieldEditOptions | Record<string, unknown>
  ) => void;
  closeFieldEdit: () => void;
  handleFieldSaved: (result?: FieldSavedResult) => Promise<void>;
};

export type CmsLivePlacementsProviderProps = {
  children: ReactNode;
};

export type PageSectionRenderProps = {
  section: PagePlacement | PlacementLike;
  surfaceTone?: string | null;
  surfaceBand?: unknown;
  surfaceBandIndex?: number;
  sectionTheme?: string;
  pageTheme?: Record<string, unknown>;
  pageContext?: Record<string, unknown> | null;
  navSections?: Array<PagePlacement | PlacementLike>;
};

export type CmsPageSectionRenderProps = {
  placement: PlacementWithSurface;
  navSections?: Array<PagePlacement | PlacementLike>;
};

export type PublicPageSectionsProps = {
  pageKey: string;
  sections?: PagePlacement[] | unknown[];
  initialTheme?: Record<string, unknown> | null;
  pageContext?: Record<string, unknown> | null;
};

export type PublicPageSectionsSuspenseProps = {
  children: ReactNode;
  compact?: boolean;
};

export type ResolvedPageSectionsProps = {
  pageKey: string;
  entityId?: string | number | null;
  pageContext?: Record<string, unknown> | null;
};

export type CmsLivePageSettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export type MappedSectionsTabProps = {
  onClose: () => void;
};

export type AddSectionTabProps = {
  onError?: (msg: string | null) => void;
};

export type ThemeSettingsTabProps = {
  busy?: boolean;
  onError?: (msg: string | null) => void;
};

export type FetchLivePlacementsOptions = {
  catalog?: SectionCatalogEntry[];
  sortDisabled?: boolean;
  fetchPage?: boolean;
  fetchCatalog?: boolean;
};

export type FetchLivePlacementsResult = {
  sections: PagePlacement[];
  catalog: SectionCatalogEntry[];
  sortDisabled: boolean;
  pageDoc: Record<string, unknown> | null;
};

export type ResolveFieldEditDeps = {
  savePlacement: CmsLivePlacementsContextValue["savePlacement"];
  reload: () => Promise<PagePlacement[]>;
  setError: (msg: string | null) => void;
  setSaving: (v: boolean) => void;
};

export type ResolveFieldEditResult =
  | { handled: true; editing?: undefined }
  | { handled: false; editing: FieldEditState };
