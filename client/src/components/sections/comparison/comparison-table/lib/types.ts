import type { ReactNode } from "react";

export type ComparisonUiItem = {
  id?: string;
  option?: string;
  highlight?: string;
  notes?: string;
  buttons?: unknown[];
};

export type ComparisonTableUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: ComparisonUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type ComparisonTableSectionProps = {
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
