import type { ReactNode } from "react";

/** Plain cast profile card for {@link CastProfilesUi}. */
export type CastProfileUiItem = {
  id?: string;
  imageUrl?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type CastProfilesUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: CastProfileUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type CastProfilesSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
