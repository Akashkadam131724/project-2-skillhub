import type { ReactNode } from "react";

/** Plain builder feature card for {@link BuilderFeatureCardsUi}. */
export type BuilderFeatureCardUiItem = {
  id?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type BuilderFeatureCardsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: BuilderFeatureCardUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type BuilderFeatureCardsSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
