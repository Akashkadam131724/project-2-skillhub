import type { ReactNode } from "react";

/** Plain stack card for {@link CardStackUi}. */
export type CardStackUiItem = {
  id?: string;
  imageUrl?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type CardStackUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: CardStackUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type CardStackSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
