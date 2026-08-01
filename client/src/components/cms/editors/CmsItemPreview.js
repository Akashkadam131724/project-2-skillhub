"use client";

import SectionItemCard from "@/components/sections/SectionItemCard";

/** Thin CMS wrapper — same cards as the live page */
export default function CmsItemPreview({ preview, item }) {
  if (!item) return null;
  return <SectionItemCard type={preview} item={item} preview />;
}
