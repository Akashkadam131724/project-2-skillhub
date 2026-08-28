"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import { mediaAlt } from "@/lib/utils/media-alt";
import type { CustomerTestimonialUiItem } from "./lib/types";

function StarRow({ rating = 5 }: { rating?: number | string }) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 5)));
  return (
    <div className="mb-5 flex gap-x-1" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarRatingIcon
          key={i}
          className={`size-4 shrink-0 ${i < n ? "text-brand" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export type TestimonialSlideProps = {
  item?: CustomerTestimonialUiItem | Record<string, unknown> | null;
  preview?: boolean;
};

/** Single slide — oversized quote + author rail */
export function TestimonialSlide({ item, preview = false }: TestimonialSlideProps) {
  const row = (item || {}) as CustomerTestimonialUiItem;
  const quote =
    row.quote ||
    String((item as Record<string, unknown>)?.body || "");
  const author =
    row.author ||
    String((item as Record<string, unknown>)?.title || "");
  const logo = row.logoUrl;
  const rating = row.rating ?? 5;
  const raw = row.raw || (item as Record<string, unknown>);

  return (
    <figure
      data-section-surface="light-card"
      data-light-surface
      className="customer-testimonial-card relative m-0 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white via-white to-brand-soft/40 p-7 sm:p-10 lg:p-12"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-4 right-6 font-[family-name:var(--font-display)] text-[7rem] leading-none text-brand/10 select-none sm:text-[9rem]"
      >
        “
      </span>
      <StarRow rating={rating} />
      <blockquote className="section-theme-heading relative m-0 max-w-3xl text-left font-[family-name:var(--font-display)] text-xl leading-snug font-medium tracking-tight sm:text-2xl lg:text-[1.85rem]">
        <CmsRichText
          html={quote}
          className="section-theme-muted [&_p]:text-slate-700"
          empty={
            preview ? (
              <p className="section-theme-muted m-0">Add quote…</p>
            ) : null
          }
        />
      </blockquote>
      <figcaption className="relative mt-8 flex flex-col gap-4 border-t border-slate-200/80 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="section-theme-heading text-base font-semibold sm:text-lg">
            {author || (preview ? "Author…" : null)}
          </div>
          <p className="section-theme-muted mt-1 mb-0 text-sm">
            SkillHub learner feedback
          </p>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={mediaAlt(raw, author ? `${author} logo` : "Company logo")}
            className="h-10 w-auto shrink-0 object-contain opacity-90 sm:h-12"
          />
        ) : preview ? (
          <span className="section-theme-subtle text-xs italic">
            Company logo…
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

export default TestimonialSlide;
