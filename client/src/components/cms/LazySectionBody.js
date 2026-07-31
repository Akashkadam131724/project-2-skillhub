"use client";

import { resolveLazySectionComponent } from "@/lib/section-component-loaders";
import FallbackSection from "@/components/sections/FallbackSection";

/** Code-split section renderer for public pages. */
export default function LazySectionBody({ sectionKey, renderKey, compProps }) {
  const Comp = resolveLazySectionComponent(sectionKey, renderKey) || FallbackSection;
  return <Comp {...compProps} />;
}
