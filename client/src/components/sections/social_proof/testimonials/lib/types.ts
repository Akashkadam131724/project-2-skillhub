import type { ReactNode } from "react";

export type TestimonialUiItem = {
  id?: string;
  quote?: string;
  author?: string;
};

export type TestimonialsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: TestimonialUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type TestimonialsSectionProps = {
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
