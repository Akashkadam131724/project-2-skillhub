"use client";

import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { itemTitle } from "@/lib/sections/item-types";
import CardPlaceholder from "./CardPlaceholder";

export default function PartnerItemCard({ item, preview = false }) {
  const src = mediaUrl(item?.image_url || item?.icon || "");
  const name = itemTitle(item) || item?.title || "";

  return (
    <div className="flex items-center gap-3 rounded-lg section-ui-card border px-3 py-2">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={mediaAlt(item, "Partner logo")}
          className="h-10 w-28 object-contain"
        />
      ) : preview ? (
        <span className="text-xs text-slate-400 italic">Logo…</span>
      ) : null}
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
        {name || (preview ? <CardPlaceholder>Partner name…</CardPlaceholder> : null)}
      </span>
    </div>
  );
}
