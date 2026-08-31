"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import {
  sectionClassNames,
  sectionDarkOverlaySurfaceProps,
} from "@/lib/sections/section-design-system";

export type SectionMediaOverlayProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Light copy region on top of photos / gradients */
export default function SectionMediaOverlay<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: SectionMediaOverlayProps<T>) {
  const Tag = (as || "div") as ElementType;
  const surface = sectionDarkOverlaySurfaceProps(className);
  return (
    <Tag {...rest} {...surface} className={sectionClassNames(surface.className)}>
      {children}
    </Tag>
  );
}
