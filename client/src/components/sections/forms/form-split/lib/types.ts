import type { ReactNode } from "react";

export type FormHighlightUiItem = {
  id?: string;
  title?: string;
  subtitle?: string;
};

export type FormSplitUiProps = {
  id?: string;
  className?: string;
  contentSide?: "left" | "right";
  title?: string | null;
  subtitle?: string | null;
  body?: string;
  contentSideSlot?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  bodySlot?: ReactNode;
  footer?: ReactNode;
  highlights?: FormHighlightUiItem[];
  highlightsSlot?: ReactNode;
  itemsBar?: ReactNode;
  formSlot?: ReactNode;
  formTitle?: string;
  formSubtitle?: string;
  formKey?: string;
  submitLabel?: string;
  successMessage?: string;
  cmsMode?: boolean;
};

export type FormSplitSectionProps = {
  id?: string;
  section_title?: string;
  sub_title?: string;
  data?: {
    body?: string;
    content_side?: string;
    form_title?: string;
    form_subtitle?: string;
    form_key?: string;
    submit_label?: string;
    success_message?: string;
    [key: string]: unknown;
  };
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: () => void;
};
