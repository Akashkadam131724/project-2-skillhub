"use client";

import {
  sectionClassNames,
  sectionDarkOverlaySurfaceProps,
} from "@/lib/sections/section-design-system";

/** Light copy region on top of photos / gradients */
export default function SectionMediaOverlay({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  const surface = sectionDarkOverlaySurfaceProps(className);
  return (
    <Tag {...rest} {...surface} className={sectionClassNames(surface.className)}>
      {children}
    </Tag>
  );
}
