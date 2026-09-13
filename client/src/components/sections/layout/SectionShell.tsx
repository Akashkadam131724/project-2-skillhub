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
  /**
   * Bottom CTAs / chrome. Rendered outside the body stack so spacing comes from
   * the footer’s own `mt-*` (e.g. SectionButtonsFooter), not stack `gap-*`.
   */
  footer?: ReactNode;
  children?: ReactNode;
  /** Vertical gap between body blocks only — not header↔body or body↔footer. */
  bodyGap?: DsSpaceKey;
  className?: string;
};

/**
 * Section vertical layout — top header + body + optional footer.
 * Avoid wrapping `SectionHeader`/`footer` and body in one `SectionStack` with gap;
 * that doubles spacing (header `mb-*` / footer `mt-*` + flex `gap-*`).
 */
export default function SectionShell({
  header,
  footer = null,
  children,
  bodyGap = "stackMd",
  className = "",
}: SectionShellProps) {
  const hasBody = Children.toArray(children).length > 0;

  return (
    <div className={sectionClassNames("flex flex-col", className)}>
      {header}
      {hasBody ? <SectionStack gap={bodyGap}>{children}</SectionStack> : null}
      {footer}
    </div>
  );
}
