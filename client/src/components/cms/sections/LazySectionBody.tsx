"use client";

import { resolveLazySectionComponent } from "@/lib/sections/section-component-loaders";
import FallbackSection from "@/components/sections/FallbackSection";
import type { LazySectionBodyProps } from "./types";

/** Code-split section renderer for public pages. */
export default function LazySectionBody({
  sectionKey,
  renderKey,
  compProps,
}: LazySectionBodyProps) {
  const Comp = resolveLazySectionComponent(sectionKey, renderKey) || FallbackSection;
  return <Comp {...compProps} />;
}
