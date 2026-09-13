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
   * CMS items bar / leading chrome. Outside the body stack so its own
   * `chromeOffset` margin is not doubled by `bodyGap`.
   */
  lead?: ReactNode;
  /**
   * Bottom CTAs / chrome. Outside the body stack — spacing from footer `mt-*`
   * (`DS_SPACE.footerOffset`), not stack gap.
   */
  footer?: ReactNode;
  children?: ReactNode;
  /** Vertical gap between body blocks only — not header/lead/footer. */
  bodyGap?: DsSpaceKey;
  className?: string;
};

/**
 * Section vertical layout — header + optional lead + body + optional footer.
 * Header / lead / footer own their margins; body stack only gaps its children.
 */
export default function SectionShell({
  header,
  lead = null,
  footer = null,
  children,
  bodyGap = "stackMd",
  className = "",
}: SectionShellProps) {
  const hasBody = Children.toArray(children).length > 0;

  return (
    <div className={sectionClassNames("flex flex-col", className)}>
      {header}
      {lead}
      {hasBody ? <SectionStack gap={bodyGap}>{children}</SectionStack> : null}
      {footer}
    </div>
  );
}
