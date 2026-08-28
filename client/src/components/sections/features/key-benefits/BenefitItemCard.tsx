"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";

export type BenefitItemCardProps = {
  item?: {
    body?: string;
    subtitle?: string;
    image_url?: string;
    image?: string;
    buttons?: unknown[];
    [key: string]: unknown;
  } | null;
  title?: string;
  body?: string;
  imageUrl?: string;
  buttons?: unknown[];
  preview?: boolean;
};

/** Benefit card — prefer plain title/body/imageUrl; `item` for CMS previews. */
export default function BenefitItemCard({
  item,
  title,
  body,
  imageUrl,
  buttons,
  preview = false,
}: BenefitItemCardProps) {
  const resolvedTitle = title ?? (item ? itemTitle(item) : "");
  const desc = body ?? item?.body ?? item?.subtitle ?? "";
  const imgSrc =
    imageUrl ||
    (item ? mediaUrl(item.image_url || item.image || "") : "") ||
    "";
  const list = Array.isArray(buttons)
    ? buttons
    : Array.isArray(item?.buttons)
      ? item.buttons
      : [];
  const showImage = Boolean(imgSrc) || preview;

  return (
    <article
      data-section-surface="light-card"
      data-light-surface=""
      className="section-light-card section-ui-card flex h-full flex-col overflow-hidden rounded-xl border"
    >
      {showImage ? (
        <div className="relative h-56 w-full shrink-0 overflow-hidden sm:aspect-[16/10] sm:h-auto">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item || { title: resolvedTitle }, "Benefit")}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400 italic dark:bg-slate-900 dark:text-slate-600">
              Add image…
            </div>
          )}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="m-0 text-base font-bold leading-snug tracking-tight section-theme-heading sm:text-[1.05rem]">
          {resolvedTitle ||
            (preview ? <CardPlaceholder>Benefit…</CardPlaceholder> : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="text-sm leading-relaxed section-theme-muted"
            empty={
              preview ? (
                <p className="m-0 text-sm leading-relaxed section-theme-muted">
                  <CardPlaceholder>Description…</CardPlaceholder>
                </p>
              ) : null
            }
          />
        ) : null}
        {list.length ? (
          <SectionButtons
            buttons={list}
            className="mt-auto flex flex-wrap items-center gap-2 pt-2"
          />
        ) : null}
      </div>
    </article>
  );
}
