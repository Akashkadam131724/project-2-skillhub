"use client";

import { useEffect, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import { mediaUrl } from "@/lib/cms-api";
import {
  itemAuthor,
  itemQuote,
  resolveItemsForSection,
} from "@/lib/item-types";
import CmsRichText from "@/components/cms/CmsRichText";

function StarRow({ rating = 5 }) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 5)));
  return (
    <div
      className="mb-4 flex gap-x-1 sm:mb-5"
      aria-label={`${n} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`size-5 shrink-0 ${
            i < n ? "text-brand" : "text-slate-200 dark:text-slate-700"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
}

/** Single slide — stars, quote, author + company logo */
export function TestimonialSlide({ item, preview = false }) {
  const quote = itemQuote(item);
  const author = itemAuthor(item);
  const logo = mediaUrl(item?.image_url || item?.icon || "");
  const rating = item?.value || item?.label || 5;

  return (
    <figure className="m-0 max-w-3xl">
      <StarRow rating={rating} />
      <blockquote className="m-0 text-left text-base font-medium leading-relaxed tracking-tight text-slate-800 sm:text-lg md:text-xl dark:text-slate-100">
        <CmsRichText
          html={quote}
          empty={
            preview ? <p className="m-0">Add quote…</p> : null
          }
        />
      </blockquote>
      <figcaption className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1 text-left">
          <div className="text-base font-semibold text-ink sm:text-lg dark:text-white">
            {author || (preview ? "Author…" : null)}
          </div>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
            className="h-10 w-auto shrink-0 object-contain sm:h-12"
          />
        ) : preview ? (
          <span className="text-xs text-slate-400 italic">Company logo…</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * Customer testimonials carousel (global) — uses shared SectionFrame spacing.
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
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {items.map((item, i) => (
                <div key={item._id || item.id || i} className="w-full shrink-0">
                  <TestimonialSlide item={item} />
                </div>
              ))}
            </div>
          </div>

          {count > 1 ? (
            <div className="mt-8 flex items-center justify-start gap-3 sm:mt-10 sm:gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                aria-label="Previous testimonial"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
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
                    className={`size-2.5 rounded-full border-0 transition ${
                      i === index
                        ? "bg-brand"
                        : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                aria-label="Next testimonial"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
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
