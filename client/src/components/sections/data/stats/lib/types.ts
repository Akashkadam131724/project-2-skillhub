import type { ReactNode } from "react";

/** Plain stat tile for {@link StatsUi}. */
export type StatUiItem = {
  id?: string;
  value?: string;
  label?: string;
};

export type StatsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: StatUiItem[];
  /** Glass tiles on dark band vs light cards. */
  onDarkBand?: boolean;
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type StatsSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  section_theme?: unknown;
  sectionTheme?: unknown;
  surfaceTone?: unknown;
  surfaceBand?: unknown;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
};
