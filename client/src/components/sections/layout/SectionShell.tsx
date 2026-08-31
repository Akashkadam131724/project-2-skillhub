import { Children, type ReactNode } from "react";
import SectionStack from "./SectionStack";
import {
  sectionClassNames,
  type DsSpaceKey,
} from "@/lib/layout/section-layout-system";

export type SectionShellProps = {
  /**
   * Top-band `SectionHeader`. Pass `spaced={hasBody}` on the header — its
   * `headerBody` margin is the only rhythm between header and body (no stack gap).
   */
  header?: ReactNode;
  children?: ReactNode;
  /** Vertical gap between body blocks only — not between header and first body child. */
  bodyGap?: DsSpaceKey;
  className?: string;
};

/**
 * Section vertical layout — top header + body.
 * Avoid wrapping `SectionHeader` and body in `SectionStack` with gap; that doubles
 * spacing (header `mb-*` + flex `gap-*`).
 */
export default function SectionShell({
  header,
  children,
  bodyGap = "stackMd",
  className = "",
}: SectionShellProps) {
  const hasBody = Children.toArray(children).length > 0;

  return (
    <div className={sectionClassNames("flex flex-col", className)}>
      {header}
      {hasBody ? <SectionStack gap={bodyGap}>{children}</SectionStack> : null}
    </div>
  );
}
