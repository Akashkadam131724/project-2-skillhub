import type { ReactNode } from "react";

export type VideoBannerUiItem = {
  title?: string;
  subtitle?: string;
  videoSrc?: string;
  fallbackImageUrl?: string;
  buttons?: unknown[];
};

export type VideoBannerUiProps = {
  id?: string;
  item?: VideoBannerUiItem | null;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  mediaSlot?: ReactNode;
  itemsBar?: ReactNode;
  footer?: ReactNode;
};

export type VideoBannerSectionProps = {
  items?: unknown[];
  section_key?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
};
