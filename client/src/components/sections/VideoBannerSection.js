"use client";

import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { parseYoutubeVideoId } from "@/lib/button-types";
import { resolveItemsForSection } from "@/lib/item-types";
import CmsSectionItemsBar from "./CmsSectionItemsBar";
import SectionButtonsFooter from "./SectionButtonsFooter";

function youtubeBannerSrc(videoUrl) {
  const id = parseYoutubeVideoId(videoUrl);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "1",
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
  const hasCopy = Boolean(title || subtitle || buttons.length);

  if (!item && !cmsMode) return null;

  return (
    <section className="overflow-hidden bg-black text-white">
      <div className="relative w-full bg-black">
        {src ? (
          <iframe
            src={src}
            title={title || "Video banner"}
            className="block aspect-video w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreenc

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
      </div>

      {hasCopy || cmsMode ? (
        <div className="border-t border-white/10 bg-gradient-to-br from-slate-950 via-black to-slate-950">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-6 lg:px-10 lg:py-8">
            <div className="min-w-0 flex-1">
              {title ? (
                <h1 className="m-0 font-[family-name:var(--font-display)] text-2xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-2 mb-0 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-3 sm:text-base lg:text-lg">
                  {subtitle}
                </p>
              ) : null}
              {cmsMode ? (
                <CmsSectionItemsBar
                  sectionKey={section_key}
                  cmsMode
                  onEditField={onEditField}
                  itemCount={item ? 1 : 0}
                  className="mt-4 [&_p]:text-white/60 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white"
                />
              ) : null}
            </div>

            {buttons.length || cmsMode ? (
              <SectionButtonsFooter
                buttons={buttons}
                cmsMode={cmsMode}
                editField="items"
                onEditField={(field) =>
                  onEditField?.(field, { expandItemButtons: true })
                }
                onFormOpen={onFormOpen}
                inverted
                className="shrink-0 sm:mt-0"
                buttonsClassName="flex flex-wrap items-center justify-start gap-3 sm:justify-end"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
