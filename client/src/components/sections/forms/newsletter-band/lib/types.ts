import type { ReactNode } from "react";

export type NewsletterBandSectionProps = {
  id?: string;
  section_title?: string;
  sub_title?: string;
  data?: { email_placeholder?: string };
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: () => void;
};

export type NewsletterBandUiProps = {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  formFooter?: ReactNode;
};
