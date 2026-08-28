"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import FeatureCardPlaceholder from "./FeatureCardPlaceholder";

export type AwardCardProps = {
  item?: {
    body?: string;
    subtitle?: string;
    image_url?: string;
    icon?: string;
    title?: string;
    [key: string]: unknown;
  } | null;
  title?: string;
  body?: string;
  imageUrl?: string;
  preview?: boolean;
  index?: number;
};

/** Award / recognition — prefer plain title/body/imageUrl; `item` for CMS previews. */
export default function AwardCard({
  item,
  title,
  body,
  imageUrl,
  preview = false,
  index = 0,
}: AwardCardProps) {
  const resolvedTitle = title ?? (item ? itemTitle(item) || item?.title || "" : "");
  const desc = body ?? item?.body ?? item?.subtitle ?? "";
  const imgSrc =
    imageUrl ||
    (item ? mediaUrl(item.image_url || item.icon || "") : "") ||
    "";
  const n = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-6 transition duration-500 hover:-translate-y-1 hover:border-brand/25 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-brand/10 blur-2xl transition group-hover:bg-brand/20"
      />
      <div className="relative mb-5 flex items-start justify-between gap-3">
        <div className="flex h-24 w-28 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-slate-800">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item || { title: resolvedTitle }, "Award")}
              className="max-h-16 max-w-[5.5rem] object-contain"
            />
          ) : preview ? (
            <span className="text-xs text-slate-400 italic dark:text-slate-600">
              Add award badge…
            </span>
          ) : null}
        </div>
        <span className="font-[family-name:var(--font-display)] text-3xl font-semibold text-brand/25">
          {n}
        </span>
      </div>
      <div className="relative flex flex-1 flex-col gap-2.5">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-xl leading-snug font-semibold tracking-tight section-theme-heading">
          {resolvedTitle ||
            (preview ? (
              <FeatureCardPlaceholder>Award title…</FeatureCardPlaceholder>
            ) : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="text-sm leading-relaxed section-theme-muted"
            empty={
              preview ? (
                <p className="m-0 text-sm leading-relaxed section-theme-muted">
                  <FeatureCardPlaceholder>Description…</FeatureCardPlaceholder>
                </p>
              ) : null
            }
          />
        ) : null}
      </div>
    </article>
  );
}
