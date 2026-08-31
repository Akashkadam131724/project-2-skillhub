import type { ReactNode } from "react";

export type TabsLayout = "vertical" | "horizontal" | "underline";

export type TabChildUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  href?: string;
  label?: string;
  buttons?: unknown[];
};

export type TabUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  body?: string;
  imageUrl?: string;
  buttons?: unknown[];
  children?: TabChildUiItem[];
};

export type TabsNestedUiProps = {
  layout: TabsLayout;
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  eyebrowSlot?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  tabs?: TabUiItem[];
  preview?: boolean;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
  className?: string;
};

export type TabsSectionProps = {
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

export type SuccessStoryUiItem = {
  id?: string;
  icon?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  logoUrl?: string;
  videoUrl?: string;
  gradient?: string;
  buttons?: unknown[];
};

export type SuccessStoriesUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  stories?: SuccessStoryUiItem[];
  preview?: boolean;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
  className?: string;
};

export type SuccessStoriesSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
};
