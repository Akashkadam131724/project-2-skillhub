import type { ReactNode } from "react";

export type MediaMosaicTileUiItem = {
  id?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  buttons?: unknown[];
  featured?: boolean;
};

export type MediaMosaicUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: MediaMosaicTileUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type MediaMosaicSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
};
