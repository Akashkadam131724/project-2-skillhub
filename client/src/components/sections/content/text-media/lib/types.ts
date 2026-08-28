import type { ReactNode } from "react";

export type TextMediaUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  mediaPosition?: "start" | "end";
};

export type TextMediaUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: TextMediaUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type TextMediaSectionProps = {
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
