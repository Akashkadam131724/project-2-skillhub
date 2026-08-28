"use client";

import SectionButtons from "@/components/ui/SectionButtons";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import type { MediaMosaicTileUiItem } from "./lib/types";

export type MediaMosaicItemCardProps = {
  item?: MediaMosaicTileUiItem | Record<string, unknown> | null;
  preview?: boolean;
  featured?: boolean;
};

export default function MediaMosaicItemCard({
  item,
  preview = false,
  featured = false,
}: MediaMosaicItemCardProps) {
  const row = (item || {}) as MediaMosaicTileUiItem & Record<string, unknown>;
  const imageUrl =
    row.imageUrl ||
    String(row.image_url || row.image || "");
  const title = row.title || "";
  const subtitle = row.subtitle || "";
  const buttons = Array.isArray(row.buttons) ? row.buttons : [];
  const span = featured ? "sm:col-span-2 sm:row-span-2" : "";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${span}`}
    >
      <div
        className={`relative w-full bg-slate-200 dark:bg-slate-800 ${
          featured ? "aspect-[16/10] min-h-[220px]" : "aspect-[4/3]"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title || "Mosaic tile"}
            className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-slate-400">
            {preview ? <CardPlaceholder>Image</CardPlaceholder> : "Image"}
          </div>
        )}
        <div className="from-ink/75 via-ink/20 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          {title || preview ? (
            <h3 className="m-0 text-base font-semibold text-white sm:text-lg">
              {title || <CardPlaceholder>Title</CardPlaceholder>}
            </h3>
          ) : null}
          {subtitle || preview ? (
            <p className="mt-1 text-sm text-white/85">
              {subtitle || (preview ? <CardPlaceholder>Caption</CardPlaceholder> : null)}
            </p>
          ) : null}
          {buttons.length ? (
            <div className="mt-3">
              <SectionButtons
                buttons={buttons}
                inverted
                className="flex flex-wrap gap-2"
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
