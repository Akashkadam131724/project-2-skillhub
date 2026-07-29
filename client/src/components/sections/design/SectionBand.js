"use client";

import SectionWrapper from "@/components/sections/SectionWrapper";
import {
  SECTION_BAND_SHELL_CLASS,
  sectionClassNames,
} from "@/lib/section-design-system";

/**
 * Transparent section root inside SectionSurface — band background comes from the page stack.
 */
export default function SectionBand({
  as: Tag = "section",
  id,
  padding = "lg",
  decor,
  wrapper = false,
  className = "",
  children,
}) {
  const pad =
    padding === "sm"
      ? "py-14 sm:py-16 lg:py-20"
      : "py-16 sm:py-20 lg:py-24";

  const inner = wrapper ? (
    <SectionWrapper>{children}</SectionWrapper>
  ) : (
    children
  );

  return (
    <Tag
      id={id || undefined}
      className={sectionClassNames(
        SECTION_BAND_SHELL_CLASS,
        "relative isolate overflow-hidden",
        pad,
        className
      )}
    >
      {decor}
      {inner}
    </Tag>
  );
}
