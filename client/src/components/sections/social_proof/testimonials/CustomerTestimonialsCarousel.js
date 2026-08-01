"use client";

import { useEffect, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import {
  itemAuthor,
  itemQuote,
  resolveItemsForSection,
} from "@/lib/item-types";
import CmsRichText from "@/components/cms/CmsRichText";
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import ChevronLeftSmIcon from "@/components/icons/ChevronLeftSmIcon";
import ChevronRightSmIcon from "@/components/icons/ChevronRightSmIcon";

function StarRow({ rating = 5 }) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 5)));
  return (
    <div
      className="mb-5 flex gap-x-1"
      aria-label={`${n} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <StarRatingIcon
          key={i}
          className={`size-4 shrink-0 ${i < n ? "text-brand" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

/** Single slide — oversized quote + author rail */
export function TestimonialSlide({ item, preview = false }) {
  const quote = itemQuote(item);
  const author = itemAuthor(item);
  const logo = mediaUrl(item?.image_url || item?.icon || "");
  const rating = item?.value || item?.label || 5;

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
      <blockquote className="relative m-0 max-w-3xl text-left font-[family-name:var(--font-display)] text-xl leading-snug font-medium tracking-tight section-theme-heading sm:text-2xl lg:text-[1.85rem]">
        <CmsRichText
          html={quote}
          className="section-theme-muted [&_p]:text-slate-700"
          empty={preview ? <p className="section-theme-muted m-0">Add quote…</p> : null}
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
            alt={mediaAlt(item, author ? `${author} logo` : "Company logo")}
            className="h-10 w-auto shrink-0 object-contain opacity-90 sm:h-12"
          />
        ) : preview ? (
          <span className="section-theme-subtle text-xs italic">Company logo…</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * Customer testimonials carousel — modern quote panel.
 */
export default function CustomerTestimonialsCarousel({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "customer_testimonials",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (cmsMode || items.length < 2) return undefined;
    const idTimer = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 7000);
    return () => window.clearInterval(idTimer);
  }, [cmsMode, items.length]);

  if (!items.length && !cmsMode) return null;

  const count = items.length;

  function go(delta) {
    if (!count) return;
    setIndex((i) => (i + delta + count) % count);
  }

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="Stories"
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />

      {count ? (
        <div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {items.map((item, i) => (
                <div key={item._id || item.id || i} className="w-full shrink-0 px-0.5">
                  <TestimonialSlide item={item} />
                </div>
              ))}
            </div>
          </div>

          {count > 1 ? (
            <div
              className="mt-8 flex items-center justify-start gap-3 sm:mt-10 sm:gap-4"
              data-section-surface="light-card"
              data-light-surface
            >
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition hover:border-brand hover:text-brand"
                aria-label="Previous testimonial"
              >
                <ChevronLeftSmIcon />
              </button>

              <div className="flex gap-2" role="tablist">
                {items.map((item, i) => (
                  <button
                    key={item._id || item.id || i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full border-0 transition-all ${i === index
                        ? "w-7 bg-brand"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition hover:border-brand hover:text-brand"
                aria-label="Next testimonial"
              >
                <ChevronRightSmIcon />
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
