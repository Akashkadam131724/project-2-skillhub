import type { ReactNode } from "react";

/** Plain spotlight card for {@link FeatureSpotlightUi}. */
export type FeatureSpotlightUiItem = {
  id: string;
  imageUrl?: string;
  imageAlt?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  large?: boolean;
};

export type FeatureSpotlightUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: FeatureSpotlightUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type FeatureSpotlightSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
