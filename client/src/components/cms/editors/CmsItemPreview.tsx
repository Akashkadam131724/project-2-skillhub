"use client";

import SectionItemCard from "@/components/sections/SectionItemCard";
import type { CmsItemPreviewProps } from "./types";

/** Thin CMS wrapper — same cards as the live page */
export default function CmsItemPreview({ preview, item, index = 0 }: CmsItemPreviewProps) {
  if (!item) return null;
  return (
    <SectionItemCard type={preview} item={item} preview index={index} />
  );
}
