import type { ReactNode } from "react";

export type TrustBadgeUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  imageUrl?: string;
};

export type TrustBadgesUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: TrustBadgeUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type TrustBadgesSectionProps = {
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
