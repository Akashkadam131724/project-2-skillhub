"use client";

import {
  sectionClassNames,
  sectionLightCardSurfaceProps,
} from "@/lib/section-design-system";

/**
 * White card surface — ink text and fields on any band (especially dark).
 */
export default function SectionLightCard({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  const surface = sectionLightCardSurfaceProps();
  return (
    <Tag
      {...surface}
      {...rest}
      className={sectionClassNames(surface.className, className)}
    >
      {children}
    </Tag>
  );
}
