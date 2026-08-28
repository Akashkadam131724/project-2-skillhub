import type { ReactNode } from "react";

/** Plain bento cell for {@link BentoGridUi}. */
export type BentoGridUiItem = {
  id?: string;
  imageUrl?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type BentoGridUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: BentoGridUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type BentoGridSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
