import type { ReactNode } from "react";

/** Plain FAQ row — shared by all accordion variants. */
export type FaqUiItem = {
  id?: string;
  question?: string;
  answer?: string;
  buttons?: unknown[];
};

/** Placement props for public + CMS accordion adapters. */
export type FaqSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  sectionTheme?: unknown;
  section_theme?: unknown;
  surfaceTone?: unknown;
  surfaceBand?: unknown;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
  data?: { header_side?: string; title_side?: string; [key: string]: unknown };
};

/** Base accordion UI shell props (title slots, items, band). */
export type AccordionUiBaseProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: FaqUiItem[];
  darkBand?: boolean;
  preview?: boolean;
  id?: string;
  className?: string;
};
