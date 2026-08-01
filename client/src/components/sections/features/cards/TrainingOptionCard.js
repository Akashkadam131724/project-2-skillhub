"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isRichTextEmpty } from "@/lib/rich-text";
import { itemTitle } from "@/lib/item-types";
import FeatureCardPlaceholder from "./FeatureCardPlaceholder";

/** Photo card — image-led modality tile */
export default function TrainingOptionCard({ item, preview = false, index = 0 }) {
  const title = itemTitle(item) || item?.title || "";
  const desc = item?.body || item?.subtitle || "";
  const imgSrc = mediaUrl(item?.image_url || item?.icon || "");
  const showImage = Boolean(imgSrc) || preview;
  const n = String(index + 1).padStart(2, "0");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-ink text-white shadow-[0_28px_70px_-40px_color-mix(in_srgb,var(--ink)_55%,transparent)] transition duration-500 hover:-translate-y-1">
      {showImage ? (
        <div className="relative h-56 w-full shrink-0 overflow-hidden sm:aspect-[16/11] sm:h-auto">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item, "Training option")}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-white/40 italic">
              Add image…
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
          <span className="absolute top-4 left-4 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-white/85 backdrop-blur-sm">
            {n}
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2.5 px-5 py-5 sm:px-6 sm:py-6">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-xl leading-snug font-semibold tracking-tight text-white">
          {title || (preview ? <FeatureCardPlaceholder>Option title…</FeatureCardPlaceholder> : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="text-sm leading-relaxed text-white/70 [&_a]:text-white [&_strong]:text-white"
            empty={
              preview ? (
                <p className="m-0 text-sm leading-relaxed text-white/50">
                  <FeatureCardPlaceholder>Description…</FeatureCardPlaceholder>
                </p>
              ) : null
            }
          />
        ) : null}
        {Array.isArray(item?.buttons) && item.buttons.length ? (
          <SectionButtons
            buttons={item.buttons}
            className="mt-auto flex flex-wrap items-center gap-2 pt-3"
          />
        ) : null}
      </div>
    </article>
  );
}
