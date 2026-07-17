"use client";

import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { parseYoutubeVideoId } from "@/lib/button-types";
import { resolveItemsForSection } from "@/lib/item-types";
import SectionButtonsFooter from "./SectionButtonsFooter";

function youtubeBannerSrc(videoUrl) {
  const id = parseYoutubeVideoId(videoUrl);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export default function VideoBannerSection({
  items: mappingItems,
  section_key = "video_banner",
  cmsMode = false,
  onEditField,
  onFormOpen,
}) {
  const [item] = resolveItemsForSection(section_key, mappingItems);
  const videoUrl = String(item?.href || "").trim();
  const src = youtubeBannerSrc(videoUrl);
  const fallbackImage = mediaUrl(item?.image_url || "");
  const title = item?.title || "";
  const subtitle = item?.subtitle || "";
  const buttons = Array.isArray(item?.buttons) ? item.buttons : [];

  if (!item && !cmsMode) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      {src ? (
        <iframe
          src={src}
          title={title || "Video banner"}
          className="block aspect-video w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : fallbackImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackImage}
          alt={mediaAlt(item, "Video banner")}
          className="block aspect-video w-full object-cover"
        />
      ) : cmsMode ? (
        <div className="flex aspect-video w-full items-center justify-center border border-dashed border-white/25 bg-slate-950 text-sm text-white/50">
          Add a video URL in the banner item.
        </div>
      ) : null}

      {title || subtitle || buttons.length || cmsMode ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 sm:p-6 lg:p-10">
          <div className="max-w-3xl">
            {title ? (
              <h1 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-3 mb-0 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-lg">
                {subtitle}
              </p>
            ) : null}
            <SectionButtonsFooter
              buttons={buttons}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              inverted
              className="mt-5"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
