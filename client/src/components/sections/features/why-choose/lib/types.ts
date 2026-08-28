import type { ReactNode } from "react";

/** Plain why-choose card for {@link WhyChooseUi}. */
export type WhyChooseUiItem = {
  id?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
};

export type WhyChooseUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  eyebrowSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: WhyChooseUiItem[];
  /** Glass cards on dark band vs white cards on light. */
  onDarkBand?: boolean;
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type WhyChooseSectionProps = {
  section_title?: string;
  sub_title?: string;
  in_page_nav_title?: string;
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
