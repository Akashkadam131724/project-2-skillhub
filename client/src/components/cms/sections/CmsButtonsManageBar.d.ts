import type { ReactNode } from "react";

export default function CmsButtonsManageBar(props: {
  count?: number;
  editField?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  inverted?: boolean;
}): ReactNode;
