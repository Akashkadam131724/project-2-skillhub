import type { ReactNode } from "react";

export type BlogDirectoryUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
};

export type BlogDirectorySectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: { limit?: number; [key: string]: unknown } | null;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
