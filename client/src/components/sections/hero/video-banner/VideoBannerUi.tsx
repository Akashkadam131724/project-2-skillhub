import { mediaAlt } from "@/lib/utils/media-alt";
import type { VideoBannerUiProps } from "./lib/types";

export default function VideoBannerUi({
  id,
  item,
  titleSlot,
  subtitleSlot,
  mediaSlot,
  itemsBar = null,
  footer = null,
}: VideoBannerUiProps) {
  const title = item?.title || "";
  const subtitle = item?.subtitle || "";
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showCopy = showTitle || showSubtitle || itemsBar || footer;

  return (
    <section id={id || undefined} className="overflow-hidden bg-black text-white">
      <div className="relative w-full bg-black">
        {mediaSlot ??
          (item?.videoSrc ? (
            <iframe
              src={item.videoSrc}
              title={title || "Video banner"}
              className="block aspect-video w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : item?.fallbackImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.fallbackImageUrl}
              alt={mediaAlt(item, "Video banner")}
              className="block aspect-video w-full object-cover"
            />
          ) : null)}
      </div>

      {showCopy ? (
        <div className="border-t border-white/10 bg-gradient-to-br from-slate-950 via-black to-slate-950">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-6 lg:px-10 lg:py-8">
            <div className="min-w-0 flex-1">
              {titleSlot ??
                (showTitle ? (
                  <h1 className="m-0 font-[family-name:var(--font-display)] text-2xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    {title}
                  </h1>
                ) : null)}
              {subtitleSlot ??
                (showSubtitle ? (
                  <p className="mt-2 mb-0 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-3 sm:text-base lg:text-lg">
                    {subtitle}
                  </p>
                ) : null)}
              {itemsBar}
            </div>
            {footer}
          </div>
        </div>
      ) : null}
    </section>
  );
}
