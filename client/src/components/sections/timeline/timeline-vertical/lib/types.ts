import type { ReactNode } from "react";

export type TimelineStepUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  buttons?: unknown[];
};

export type TimelineVerticalUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  eyebrowSlot?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: TimelineStepUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type TimelineVerticalSectionProps = {
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
