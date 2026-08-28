import type { ReactNode } from "react";

/** Plain pillar card for {@link PillarDestinationsUi}. */
export type PillarDestinationsUiItem = {
  id: string;
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  href?: string;
};

export type PillarDestinationsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: PillarDestinationsUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type PillarDestinationsSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
