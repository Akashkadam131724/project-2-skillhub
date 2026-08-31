import type { CSSProperties, ReactNode } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import SectionHeader from "./SectionHeader";
import SectionShell from "./SectionShell";
import { sectionHeaderState } from "./section-header-state";
import {
  SECTION_BAND_PADDING_LG,
  SECTION_BAND_PADDING_SM,
  sectionClassNames,
} from "@/lib/sections/section-design-system";
import type { DsSpaceKey } from "@/lib/layout/section-layout-system";
import type { SectionHeaderProps } from "./SectionHeader";

export type SectionLayoutRootProps = {
  id?: string;
  className?: string;
  /** Band vertical padding — `none` for flush bands (split CTA, sarder). */
  padding?: "sm" | "lg" | "none";
  /** `wrapper` = SectionWrapper only; `shell` = SectionShell + header (default). */
  layout?: "shell" | "wrapper";
  sectionStyle?: CSSProperties;
  bodyGap?: DsSpaceKey;
  decor?: ReactNode;
  wrapperClassName?: string;
  eyebrow?: ReactNode;
  eyebrowSlot?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  headerAction?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: unknown[];
  hasBodyContent?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  eyebrowClassName?: string;
  ariaLabelledBy?: string;
  children?: ReactNode;
};

/**
 * Standard band shell — section padding + SectionWrapper + SectionShell + header.
 * Pass body as `children` (grid, custom layout, etc.).
 */
export default function SectionLayoutRoot({
  id,
  className = "",
  padding = "sm",
  layout = "shell",
  sectionStyle,
  bodyGap = "stackMd",
  decor = null,
  wrapperClassName = "",
  eyebrow,
  eyebrowSlot,
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  headerAction,
  itemsBar,
  emptyState,
  footer,
  items,
  hasBodyContent = false,
  titleClassName = "",
  subtitleClassName = "",
  eyebrowClassName = "",
  ariaLabelledBy,
  children,
}: SectionLayoutRootProps) {
  const { showEyebrow, showTitle, showSubtitle, showHeader, hasBody } =
    sectionHeaderState({
      eyebrow,
      eyebrowSlot,
      title,
      subtitle,
      titleSlot,
      subtitleSlot,
      headerAction,
      itemsBar,
      emptyState,
      footer,
      items,
      hasBodyContent,
    });

  const pad =
    padding === "none"
      ? ""
      : padding === "lg"
        ? SECTION_BAND_PADDING_LG
        : SECTION_BAND_PADDING_SM;

  const headerProps: SectionHeaderProps = {
    eyebrow: eyebrowSlot ?? (showEyebrow ? eyebrow : undefined),
    title: titleSlot ?? (showTitle ? title : undefined),
    subtitle: subtitleSlot ?? (showSubtitle ? subtitle : undefined),
    action: headerAction,
    spaced: hasBody,
    titleClassName,
    subtitleClassName,
    eyebrowClassName,
  };

  return (
    <section
      id={id || undefined}
      style={sectionStyle}
      aria-labelledby={ariaLabelledBy}
      className={sectionClassNames(
        "relative w-full overflow-hidden bg-transparent",
        pad,
        className
      )}
    >
      {decor}
      <SectionWrapper className={wrapperClassName || undefined}>
        {layout === "wrapper" ? (
          children
        ) : (
          <SectionShell
            header={showHeader ? <SectionHeader {...headerProps} /> : null}
            bodyGap={bodyGap}
          >
            {itemsBar}
            {children}
            {footer}
          </SectionShell>
        )}
      </SectionWrapper>
    </section>
  );
}
