import type { ReactNode } from "react";

export default function CmsEditable(props: {
  cmsMode?: boolean;
  field?: string;
  label?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  children?: ReactNode;
  className?: string;
  inverted?: boolean;
}): ReactNode;
