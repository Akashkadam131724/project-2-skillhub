"use client";

import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { bannerBgStyle, bannerOverlayStyle } from "@/lib/theme/banner-bg";
import { itemTitle } from "@/lib/sections/item-types";
import type { ItemLike } from "@/lib/sections/item-types";
import PlayIcon from "@/components/icons/PlayIcon";

/** Live-matching preview of a Hero Media banner slide */
export default function HeroBannerItemCard({
  item,
  preview = false,
}: {
  item: ItemLike | null | undefined;
  preview?: boolean;
}) {
  const title = itemTitle(item) || String(item?.title || "");
  const subtitle = String(item?.subtitle || item?.body || "");
  const bgUrl = mediaUrl(String(item?.image_url || ""));
  const bgValue = String(item?.bg_color || "");
  const buttons = Array.isArray(item?.buttons) ? item.buttons : [];
  const sideImg = mediaUrl(String(item?.icon || ""));
  const hasSide = Boolean(sideImg) || preview;
  const hasVideo = Boolean(String(item?.href || "").trim());

  return (
    <div
      className="relative min-h-[14rem] overflow-hidden rounded-xl text-white sm:min-h-[16rem]"
      style={bannerBgStyle(bgValue)}
    >
      {bgUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={bannerOverlayStyle(bgValue, { hasImage: true })}
            aria-hidden
          />
        </>
      ) : null}

      {hasSide ? (
        <div className="absolute inset-y-0 right-0 z-[1] w-[46%] max-sm:hidden">
          {sideImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sideImg}
              alt={mediaAlt(item, "Hero banner media")}
              className="absolute inset-0 size-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border-l border-dashed border-white/30 bg-white/5 text-[11px] text-white/45 italic">
              Side image…
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/35 to-transparent"
            aria-hidden
          />
          {hasVideo && sideImg ? (
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-ink shadow">
                <PlayIcon className="size-5 translate-x-0.5" />
              </span>
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className={`relative z-[2] flex min-h-[14rem] flex-col justify-end gap-3 p-5 sm:min-h-[16rem] sm:p-6 ${
          hasSide ? "sm:pr-[50%]" : ""
        }`}
      >
        <h3 className="m-0 text-xl leading-tight font-bold tracking-tight text-white sm:text-2xl">
          {title ||
            (preview ? (
              <span className="text-white/40 italic">Add slide title…</span>
            ) : null)}
        </h3>
        {subtitle || preview ? (
          <p className="m-0 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-[15px]">
            {subtitle ||
              (preview ? (
                <span className="text-white/40 italic">Add subtitle…</span>
              ) : null)}
          </p>
        ) : null}
        {buttons.length ? (
          <div className="mt-1">
            <SectionButtons
              buttons={buttons}
              inverted
              className="flex flex-wrap items-center gap-2"
            />
          </div>
        ) : preview ? (
          <p className="m-0 text-xs text-white/45 italic">Add slide buttons…</p>
        ) : null}
      </div>
    </div>
  );
}
