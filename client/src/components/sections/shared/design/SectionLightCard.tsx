"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import {
  sectionClassNames,
  sectionLightCardSurfaceProps,
} from "@/lib/sections/section-design-system";

export type SectionLightCardProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * White card surface — ink text and fields on any band (especially dark).
 */
export default function SectionLightCard<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: SectionLightCardProps<T>) {
  const Tag = (as || "div") as ElementType;
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
