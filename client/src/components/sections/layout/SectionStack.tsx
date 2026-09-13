import type { ReactNode } from "react";
import {
  DS_SPACE,
  sectionClassNames,
  type DsSpaceKey,
} from "@/lib/layout/section-layout-system";

export type SectionStackProps = {
  children?: ReactNode;
  gap?: DsSpaceKey;
  className?: string;
  as?: "div" | "section" | "ul";
};

/**
 * Vertical rhythm inside a section body only.
 * Header, CMS lead bar, and footer live on `SectionShell` so their
 * `mb-*` / `mt-*` tokens are not stacked with flex gap.
 */
export default function SectionStack({
  children,
  gap = "stackMd",
  className = "",
  as: Tag = "div",
}: SectionStackProps) {
  return (
    <Tag className={sectionClassNames("flex flex-col", DS_SPACE[gap], className)}>
      {children}
    </Tag>
  );
}
