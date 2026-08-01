"use client";

import { itemTitle } from "@/lib/item-types";
import CardPlaceholder from "./CardPlaceholder";

export default function CurriculumItemCard({ item, preview = false }) {
  const title = typeof item === "string" ? item : itemTitle(item);

  return (
    <>{title || (preview ? <CardPlaceholder>Module name…</CardPlaceholder> : null)}</>
  );
}
