import type { ReactNode } from "react";

export type CmsEditableProps = {
  cmsMode?: boolean;
  field?: string;
  label?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  children?: ReactNode;
  className?: string;
  inverted?: boolean;
};

export type CmsRichTextProps = {
  html?: string;
  className?: string;
  empty?: ReactNode;
};
