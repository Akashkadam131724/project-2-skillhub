import type { FormEvent, MouseEvent, ReactNode } from "react";
import type { ButtonDraft, SectionItemDraft } from "@/components/cms/editors/types";
import type { PagePlacement, SectionCatalogEntry } from "@/components/cms/pages/types";

export type SectionCmsContextValue = {
  sectionKey: string;
  renderKey: string;
};

export type SectionCmsProviderProps = {
  section?: Record<string, unknown> | PagePlacement | null;
  sectionKey?: string;
  renderKey?: string;
  children: ReactNode;
};

export type LazySectionBodyProps = {
  sectionKey: string;
  renderKey: string;
  compProps: Record<string, unknown>;
};

export type BuildSectionCompPropsArgs = {
  section: PagePlacement | Record<string, unknown>;
  cmsMode: boolean;
  surfaceTone?: string | null;
  surfaceBand?: unknown;
  sectionTheme?: string;
  pageContext?: Record<string, unknown> | null;
  navSections?: Array<PagePlacement | Record<string, unknown>>;
  onEditField?: (
    section: PagePlacement | Record<string, unknown>,
    field: string,
    options?: Record<string, unknown>
  ) => void;
};

export type WrapSectionBodyArgs = {
  section: PagePlacement | Record<string, unknown>;
  catalogKey?: string;
  sectionBody: ReactNode;
  sectionTheme?: string;
  pageTheme?: Record<string, unknown>;
  surfaceTone?: string | null;
  surfaceBand?: unknown;
  surfaceBandIndex?: number;
};

export type PageSectionPlacementShellProps = {
  section: PagePlacement | Record<string, unknown>;
  cmsMode?: boolean;
  catalog?: SectionCatalogEntry[];
  sectionBody: ReactNode;
  cmsToolbar?: ReactNode;
};

export type CmsPagePreviewItem = {
  id: string;
  section_key: string;
  preview?: string;
  sort_order?: number;
  hidden?: boolean;
  content_scope?: string;
};

export type CmsPagePreviewStackProps = {
  items?: CmsPagePreviewItem[];
  emptyMessage?: string;
};

export type CmsButtonsManageBarProps = {
  count?: number;
  editField?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  inverted?: boolean;
};

export type CmsSectionToolbarProps = {
  section: PagePlacement | Record<string, unknown>;
  preview?: string;
  hidden?: boolean;
  layerLabel?: string | null;
  contentLocked?: boolean;
  contentLockedHref?: string | null;
  onEditField?: (
    section: PagePlacement | Record<string, unknown>,
    field: string,
    options?: Record<string, unknown>
  ) => void;
  onToggleVisibility?: (section: PagePlacement | Record<string, unknown>) => void;
  onRemoveExtra?: (section: PagePlacement | Record<string, unknown>) => void;
};

export type BandDraft = {
  bgImg?: string;
  bgColor?: string;
  theme?: string;
  [key: string]: unknown;
};

export type CmsSectionBandEditorProps = {
  draft: BandDraft;
  onChange: (next: BandDraft) => void;
  showBgImage?: boolean;
  showBgColor?: boolean;
  showTheme?: boolean;
  sectionKey?: string;
  renderKey?: string;
  bgFieldsLocked?: boolean;
  bgLockedMessage?: string;
  inheritedSurfaceTone?: string;
  inheritedSurfaceBand?: string;
  pageTheme?: Record<string, unknown>;
  pageSurfaceMode?: string;
  pageInk?: string;
  saving?: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  saveLabel?: string;
};

export type FilterOptionProps = {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
};

export type FilterGroupOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterGroupProps = {
  title: string;
  search: string;
  onSearch: (value: string) => void;
  placeholder: string;
  options: FilterGroupOption[];
  value: string;
  onChange: (value: string) => void;
  maxHeightClass?: string;
};

export type ScopeBadgeProps = {
  scope?: string;
  className?: string;
};

export type FilterChipOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterChipRowProps = {
  label: string;
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
  activeClass?: string;
};

export type ContentPageSectionRow = {
  id: string;
  section_key: string;
};

export type ContentPageSectionBuilderProps = {
  catalog?: SectionCatalogEntry[];
  value?: ContentPageSectionRow[];
  onChange?: (rows: ContentPageSectionRow[]) => void;
  disabled?: boolean;
};

export type CmsFieldMeta = {
  label: string;
  input: string;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
};

export type CmsSectionLiveEditorProps = {
  section: PagePlacement | Record<string, unknown> | null;
  onSavePatch: (patch: Record<string, unknown>) => Promise<void>;
  layerLabel?: string;
  contentLocked?: boolean;
  contentLockedHref?: string;
  contentLockedMessage?: string;
  toolbarExtra?: ReactNode;
  showVisibilityToggle?: boolean;
  onToggleStatus?: (next: boolean) => Promise<void>;
  pageContext?: Record<string, unknown> | null;
  pageKey?: string;
  entityId?: string | number | null;
  onAfterFieldSave?: () => Promise<void>;
  saveLabel?: string;
};

export type MenuItemProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  danger?: boolean;
};
