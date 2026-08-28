import type { ReactNode } from "react";

export type LearningPathStepUiItem = {
  id?: string;
  stepNumber?: string | number;
  title?: string;
  subtitle?: string;
  body?: string;
  buttons?: unknown[];
};

export type LearningPathUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  eyebrowSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: LearningPathStepUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type LearningPathSectionProps = {
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
