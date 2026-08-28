"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionImage from "@/components/sections/SectionImage";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";

export type WhyChooseItemCardProps = {
  item?: {
    body?: string;
    subtitle?: string;
    image_url?: string;
    icon?: string;
    [key: string]: unknown;
  } | null;
  title?: string;
  body?: string;
  imageUrl?: string;
  preview?: boolean;
  index?: number;
  variant?: "light" | "dark";
};

/** Why-choose card — prefer plain title/body/imageUrl; `item` for CMS previews. */
export default function WhyChooseItemCard({
  item,
  title,
  body,
  imageUrl,
  preview = false,
  index = 0,
  variant = "dark",
}: WhyChooseItemCardProps) {
  const resolvedTitle = title ?? (item ? itemTitle(item) : "");
  const desc = body ?? item?.body ?? item?.subtitle ?? "";
  const imgSrc =
    imageUrl ||
    (item ? mediaUrl(item.image_url || item.icon || "") : "") ||
    "";
  const showIcon = Boolean(imgSrc) || preview;
  const n = String((index ?? 0) + 1).padStart(2, "0");
  const light = variant === "light";
  const altSource = item || { title: resolvedTitle };

  if (light) {
    return (
      <article
        data-light-surface
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white p-6 shadow-[0_12px_40px_-28px_color-mix(in_srgb,var(--ink)_25%,transparent)] transition hover:border-brand/25 hover:shadow-md sm:p-7"
      >
        <div className="relative mb-5 flex items-start justify-between gap-3">
          {showIcon ? (
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft ring-1 ring-brand/10">
              {imgSrc ? (
                <SectionImage
                  src={imgSrc}
                  alt={mediaAlt(altSource, "Feature icon")}
                  width={32}
                  height={32}
                  sizes="32px"
                  loading="lazy"
                  className="max-h-8 max-w-8 object-contain"
                />
              ) : (
                <div className="size-8 rounded-xl bg-brand/20" />
              )}
            </div>
          ) : null}
          <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-200">
            {n}
          </span>
        </div>
        <h3 className="relative m-0 text-lg leading-snug font-semibold tracking-tight text-ink sm:text-xl">
          {resolvedTitle ||
            (preview ? <CardPlaceholder>Feature title…</CardPlaceholder> : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="relative mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px] [&_p]:text-slate-600"
            empty={
              preview ? (
                <p className="relative mt-3 mb-0 text-sm leading-relaxed text-slate-500">
                  <CardPlaceholder>Description…</CardPlaceholder>
                </p>
              ) : null
            }
          />
        ) : null}
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.1] sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-10 size-28 rounded-full bg-brand/20 blur-2xl transition group-hover:bg-brand/35"
      />
      <div className="relative mb-5 flex items-start justify-between gap-3">
        {showIcon ? (
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
            {imgSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgSrc}
                alt={mediaAlt(altSource, "Feature icon")}
                className="max-h-8 max-w-8 object-contain"
              />
            ) : (
              <div className="size-8 rounded-xl bg-brand/30" />
            )}
          </div>
        ) : null}
        <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white/25">
          {n}
        </span>
      </div>
      <h3 className="relative m-0 text-lg leading-snug font-semibold tracking-tight text-white sm:text-xl">
        {resolvedTitle ||
          (preview ? <CardPlaceholder>Feature title…</CardPlaceholder> : null)}
      </h3>
      {!isRichTextEmpty(desc) || preview ? (
        <CmsRichText
          html={desc}
          className="relative mt-3 text-sm leading-relaxed text-white/72 sm:text-[15px]"
          empty={
            preview ? (
              <p className="relative mt-3 mb-0 text-sm leading-relaxed text-white/50">
                <CardPlaceholder>Description…</CardPlaceholder>
              </p>
            ) : null
          }
        />
      ) : null}
    </article>
  );
}
