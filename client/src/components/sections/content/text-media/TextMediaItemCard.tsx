"use client";

import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { richTextPlainPreview } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import type { ItemLike } from "@/lib/sections/item-types";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";

/** Compact CMS preview for text + media rows */
export default function TextMediaItemCard({
  item,
  preview = false,
}: {
  item: ItemLike | null | undefined;
  preview?: boolean;
}) {
  const title = itemTitle(item);
  const src = mediaUrl(String(item?.image_url || ""));
  const side = String(item?.value || "").trim() || "auto";

  return (
    <div className="flex gap-3 rounded-lg section-ui-card border p-3">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={mediaAlt(item, "Media")}
          className="h-14 w-20 shrink-0 object-cover"
        />
      ) : preview ? (
        <div className="flex h-14 w-20 shrink-0 items-center justify-center border border-dashed border-slate-300 text-[10px] text-slate-400 italic">
          Image…
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-semibold section-theme-heading">
          {title || (preview ? <CardPlaceholder>Headline…</CardPlaceholder> : null)}
        </p>
        {richTextPlainPreview(String(item?.body ?? "")) ? (
          <p className="mt-1 mb-0 line-clamp-2 text-xs text-slate-500">
            {richTextPlainPreview(String(item?.body ?? ""))}
          </p>
        ) : null}
        <p className="mt-1 mb-0 text-[10px] uppercase tracking-wide text-slate-400">
          Media: {side}
        </p>
      </div>
    </div>
  );
}
