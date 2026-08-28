import type { ReactNode } from "react";

export type MasonryQuoteUiItem = {
  id?: string;
  quote?: string;
  author?: string;
  role?: string;
  avatarUrl?: string;
  avatarInitial?: string;
};

export type MasonryQuotesUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: MasonryQuoteUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type MasonryQuotesSectionProps = {
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
