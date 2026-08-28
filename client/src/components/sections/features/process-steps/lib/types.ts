import type { ReactNode } from "react";

/** Plain process step for {@link ProcessStepsUi}. */
export type ProcessStepUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type ProcessStepsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: ProcessStepUiItem[];
  onDarkBand?: boolean;
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type ProcessStepsSectionProps = {
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
