import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { OverviewUiProps } from "./lib/types";

export default function OverviewUi({
  imageUrl,
  imageAlt = "Overview",
  showImage = false,
  title,
  subtitle,
  body = "",
  imageSlot,
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: OverviewUiProps) {
  const hasImage = showImage || Boolean(imageSlot);

  return (
    <div
      className={`grid gap-8 lg:gap-12 ${
        hasImage
          ? "lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
          : ""
      }`}
    >
      {hasImage ? (
        <div className="order-1 w-full">
          {imageSlot ??
            (imageUrl ? (
              <div className="overflow-hidden rounded-[1.75rem] shadow-[0_36px_80px_-42px_color-mix(in_srgb,var(--ink)_50%,transparent)] ring-1 ring-slate-200/70 dark:ring-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="aspect-[16/10] max-h-56 w-full object-cover sm:max-h-64 md:max-h-72"
                />
              </div>
            ) : null)}
        </div>
      ) : null}

      <div className="order-2 flex min-w-0 flex-col gap-4 sm:gap-5">
        {titleSlot ??
          (title ? (
            <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.12] font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
          ) : null)}

        {subtitleSlot ??
          (subtitle ? (
            <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
              {subtitle}
            </p>
          ) : null)}

        {bodySlot ??
          (!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="text-[15px] leading-relaxed text-slate-700 sm:text-base dark:text-slate-200"
            />
          ) : null)}

        {footer}
      </div>
    </div>
  );
}
