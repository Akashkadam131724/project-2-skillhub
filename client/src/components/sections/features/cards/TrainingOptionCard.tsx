"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import {
  DS_TEXT,
  sectionLightCardSurfaceProps,
} from "@/lib/sections/section-design-system";
import FeatureCardPlaceholder from "./FeatureCardPlaceholder";

export type TrainingOptionCardProps = {
  item?: {
    body?: string;
    subtitle?: string;
    image_url?: string;
    icon?: string;
    title?: string;
    buttons?: unknown[];
    [key: string]: unknown;
  } | null;
  title?: string;
  body?: string;
  imageUrl?: string;
  buttons?: unknown[];
  preview?: boolean;
  index?: number;
  onDarkBand?: boolean;
};

/** Photo card — prefer plain title/body/imageUrl; `item` for CMS previews. */
export default function TrainingOptionCard({
  item,
  title,
  body,
  imageUrl,
  buttons,
  preview = false,
  index = 0,
  onDarkBand = false,
}: TrainingOptionCardProps) {
  const resolvedTitle =
    title ?? (item ? itemTitle(item) || item?.title || "" : "");
  const desc = body ?? item?.body ?? item?.subtitle ?? "";
  const imgSrc =
    imageUrl ||
    (item ? mediaUrl(item.image_url || item.icon || "") : "") ||
    "";
  const list = Array.isArray(buttons)
    ? buttons
    : Array.isArray(item?.buttons)
      ? item.buttons
      : [];
  const showImage = Boolean(imgSrc) || preview;
  const n = String(index + 1).padStart(2, "0");

  const surfaceProps = onDarkBand
    ? sectionLightCardSurfaceProps(
        "group section-ui-card flex h-full flex-col overflow-hidden rounded-[1.5rem] border shadow-[0_28px_70px_-40px_color-mix(in_srgb,var(--ink)_35%,transparent)] transition duration-500 hover:-translate-y-1"
      )
    : {
        "data-always-light-text": "",
        className:
          "group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink bg-ink text-white shadow-[0_28px_70px_-40px_color-mix(in_srgb,var(--ink)_55%,transparent)] transition duration-500 hover:-translate-y-1",
      };

  const titleClass = onDarkBand
    ? `m-0 font-[family-name:var(--font-display)] text-xl leading-snug font-semibold tracking-tight ${DS_TEXT.heading}`
    : "m-0 font-[family-name:var(--font-display)] text-xl leading-snug font-semibold tracking-tight text-white";

  const bodyClass = onDarkBand
    ? `text-sm leading-relaxed ${DS_TEXT.muted}`
    : "text-sm leading-relaxed text-white/70 [&_a]:text-white [&_strong]:text-white";

  const placeholderBodyClass = onDarkBand
    ? `m-0 text-sm leading-relaxed ${DS_TEXT.subtle}`
    : "m-0 text-sm leading-relaxed text-white/50";

  const imagePlaceholderClass = onDarkBand
    ? "flex h-full w-full items-center justify-center bg-slate-100 text-xs italic section-theme-subtle"
    : "flex h-full w-full items-center justify-center bg-slate-800 text-xs text-white/40 italic";

  const imageOverlayClass =
    "absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent";

  const indexBadgeClass = onDarkBand
    ? "absolute top-4 left-4 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-white"
    : "absolute top-4 left-4 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-white/85 backdrop-blur-sm";

  return (
    <article {...surfaceProps}>
      {showImage ? (
        <div className="relative h-56 w-full shrink-0 overflow-hidden sm:aspect-[16/11] sm:h-auto">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item || { title: resolvedTitle }, "Training option")}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className={imagePlaceholderClass}>Add image…</div>
          )}
          {onDarkBand ? null : <div className={imageOverlayClass} />}
          <span className={indexBadgeClass}>{n}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2.5 px-5 py-5 sm:px-6 sm:py-6">
        <h3 className={titleClass}>
          {resolvedTitle ||
            (preview ? (
              <FeatureCardPlaceholder>Option title…</FeatureCardPlaceholder>
            ) : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className={bodyClass}
            empty={
              preview ? (
                <p className={placeholderBodyClass}>
                  <FeatureCardPlaceholder>Description…</FeatureCardPlaceholder>
                </p>
              ) : null
            }
          />
        ) : null}
        {list.length ? (
          <SectionButtons
            buttons={list}
            inverted={!onDarkBand}
            className="mt-auto flex flex-wrap items-center gap-2 pt-3"
          />
        ) : null}
      </div>
    </article>
  );
}
