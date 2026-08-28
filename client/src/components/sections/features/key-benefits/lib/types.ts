import type { ReactNode } from "react";

/** Plain benefit card for {@link KeyBenefitsUi}. */
export type KeyBenefitsUiItem = {
  id?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  buttons?: unknown[];
};

export type KeyBenefitsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: KeyBenefitsUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

/** Placement props for Public + CMS adapters. */
export type KeyBenefitsSectionProps = {
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
