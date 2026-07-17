"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { bannerBgStyle, bannerOverlayStyle } from "@/lib/banner-bg";
import { isRichTextEmpty, richTextPlainPreview } from "@/lib/rich-text";
import {
  itemAnswer,
  itemAuthor,
  itemQuestion,
  itemQuote,
  itemStatLabel,
  itemStatValue,
  itemTitle,
} from "@/lib/item-types";
import {
  AwardCard,
  TrainingOptionCard,
} from "@/components/sections/cards/CardItems";
import { TestimonialSlide } from "@/components/sections/testimonials";

function Placeholder({ children }) {
  return <span className="text-slate-300 italic dark:text-slate-600">{children}</span>;
}

/** Shared FAQ accordion row — used on page + CMS preview */
export function FaqItemCard({ item, preview = false, index = 0 }) {
  const q = itemQuestion(item);
  const a = itemAnswer(item);
  const hasButtons = Array.isArray(item.buttons) && item.buttons.length > 0;
  const n = String((index ?? 0) + 1).padStart(2, "0");

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-[0_12px_40px_-32px_color-mix(in_srgb,var(--ink)_35%,transparent)] dark:border-slate-800 dark:bg-slate-950">
      <details open={preview || undefined} className="group/faq">
        <summary
          className={`flex list-none items-start justify-between gap-4 px-5 py-5 text-left outline-none marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden ${
            preview ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <span className="flex min-w-0 flex-1 items-start gap-4">
            <span className="mt-0.5 shrink-0 font-[family-name:var(--font-display)] text-lg font-semibold text-brand/70">
              {n}
            </span>
            <span className="min-w-0 flex-1 text-base font-semibold leading-snug tracking-tight text-ink sm:text-lg dark:text-white">
              {q || (preview ? <Placeholder>Question…</Placeholder> : null)}
            </span>
          </span>
          <span
            className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg leading-none font-light text-ink transition group-open/faq:border-brand group-open/faq:bg-brand group-open/faq:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-hidden
          >
            <span className="group-open/faq:hidden">+</span>
            <span className="hidden group-open/faq:inline">−</span>
          </span>
        </summary>
        {(!isRichTextEmpty(a) || preview || hasButtons) && (
          <div className="border-t border-slate-200/80 px-5 pb-5 sm:px-6 sm:pb-6 dark:border-slate-800">
            <div className="pt-4 pl-10 sm:pl-12">
              {!isRichTextEmpty(a) || preview ? (
                <CmsRichText
                  html={a}
                  className="text-[15px] leading-relaxed text-slate-600 sm:text-base dark:text-slate-300"
                  empty={
                    preview ? (
                      <p className="m-0 text-[15px] leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                        <Placeholder>Answer…</Placeholder>
                      </p>
                    ) : null
                  }
                />
              ) : null}
              {hasButtons ? (
                <div className="mt-4">
                  <SectionButtons
                    buttons={item.buttons}
                    className="flex flex-wrap items-center gap-2"
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </details>
    </div>
  );
}

export function BenefitItemCard({ item, preview = false }) {
  const title = itemTitle(item);
  const desc = item.body || item.subtitle;
  const imgSrc = mediaUrl(item.image_url || item.image || "");
  const showImage = Boolean(imgSrc) || preview;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {showImage ? (
        <div className="relative h-56 w-full shrink-0 overflow-hidden sm:aspect-[16/10] sm:h-auto">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item, "Benefit")}
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
        <h3 className="m-0 text-base font-bold leading-snug tracking-tight text-ink sm:text-[1.05rem] dark:text-white">
          {title || (preview ? <Placeholder>Benefit…</Placeholder> : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            empty={
              preview ? (
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <Placeholder>Description…</Placeholder>
                </p>
              ) : null
            }
          />
        ) : null}
        {Array.isArray(item.buttons) && item.buttons.length ? (
          <SectionButtons
            buttons={item.buttons}
            className="mt-auto flex flex-wrap items-center gap-2 pt-2"
          />
        ) : null}
      </div>
    </article>
  );
}

export function StatItemCard({ item, preview = false, className = "" }) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item);
  return (
    <div
      className={`flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10 ${className}`.trim()}
    >
      <p className="m-0 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {value || (preview ? <Placeholder>0</Placeholder> : null)}
      </p>
      <p className="mt-2 mb-0 max-w-[12rem] text-sm leading-snug text-slate-500 sm:max-w-[14rem] sm:text-[15px] dark:text-slate-400">
        {label || (preview ? <Placeholder>Label</Placeholder> : null)}
      </p>
    </div>
  );
}

export function TestimonialItemCard({ item, preview = false }) {
  const quote = itemQuote(item);
  const author = itemAuthor(item);
  return (
    <blockquote className="m-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      {!isRichTextEmpty(quote) || preview ? (
        <CmsRichText
          html={quote}
          className="text-sm text-slate-700 italic dark:text-slate-200"
          empty={
            preview ? (
              <p className="m-0 text-sm text-slate-700 italic dark:text-slate-200">
                “<Placeholder>Quote…</Placeholder>”
              </p>
            ) : null
          }
        />
      ) : null}
      {(author || preview) && (
        <footer className="mt-2 text-xs font-semibold text-slate-500">
          — {author || <Placeholder>Author</Placeholder>}
        </footer>
      )}
    </blockquote>
  );
}

/** Carousel-style customer testimonial (stars + quote + author + logo) */
export function CustomerTestimonialItemCard({ item, preview = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
      <TestimonialSlide item={item} preview={preview} />
    </div>
  );
}

export function ResourceItemCard({ item, preview = false }) {
  const title = itemTitle(item) || item.label;
  const desc = item.body || item.subtitle;
  return (
    <div>
      {item.href ? (
        <a
          href={item.href}
          className="text-sm font-medium text-brand no-underline"
          onClick={preview ? (e) => e.preventDefault() : undefined}
        >
          {title || (preview ? <Placeholder>Resource name…</Placeholder> : "Resource")}
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {title || (preview ? <Placeholder>Resource name…</Placeholder> : null)}
        </span>
      )}
      {!isRichTextEmpty(desc) ? (
        <CmsRichText
          html={desc}
          className="mt-0.5 text-xs text-slate-500"
        />
      ) : null}
      {Array.isArray(item.buttons) && item.buttons.length ? (
        <SectionButtons
          buttons={item.buttons}
          className="mt-2 flex flex-wrap items-center gap-2"
        />
      ) : null}
    </div>
  );
}

/** Compact CMS preview for text + media rows */
export function TextMediaItemCard({ item, preview = false }) {
  const title = itemTitle(item);
  const src = mediaUrl(item?.image_url || "");
  const side = String(item?.value || "").trim() || "auto";
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={mediaAlt(item, "Media")} className="h-14 w-20 shrink-0 object-cover" />
      ) : preview ? (
        <div className="flex h-14 w-20 shrink-0 items-center justify-center border border-dashed border-slate-300 text-[10px] text-slate-400 italic">
          Image…
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-semibold text-ink dark:text-white">
          {title || (preview ? <Placeholder>Headline…</Placeholder> : null)}
        </p>
        {richTextPlainPreview(item?.body) ? (
          <p className="mt-1 mb-0 line-clamp-2 text-xs text-slate-500">
            {richTextPlainPreview(item.body)}
          </p>
        ) : null}
        <p className="mt-1 mb-0 text-[10px] uppercase tracking-wide text-slate-400">
          Media: {side}
        </p>
      </div>
    </div>
  );
}

export function CurriculumItemCard({ item, preview = false }) {
  const title = typeof item === "string" ? item : itemTitle(item);
  return (
    <>{title || (preview ? <Placeholder>Module name…</Placeholder> : null)}</>
  );
}

export function WhyChooseItemCard({ item, preview = false, index = 0 }) {
  const title = itemTitle(item);
  const desc = item.body || item.subtitle;
  const imgSrc = mediaUrl(item.image_url || item.icon || "");
  const showIcon = Boolean(imgSrc) || preview;
  const n = String((index ?? 0) + 1).padStart(2, "0");

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
                alt={mediaAlt(item, "Feature icon")}
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
        {title || (preview ? <Placeholder>Feature title…</Placeholder> : null)}
      </h3>
      {!isRichTextEmpty(desc) || preview ? (
        <CmsRichText
          html={desc}
          className="relative mt-3 text-sm leading-relaxed text-white/72 sm:text-[15px]"
          empty={
            preview ? (
              <p className="relative mt-3 mb-0 text-sm leading-relaxed text-white/50">
                <Placeholder>Description…</Placeholder>
              </p>
            ) : null
          }
        />
      ) : null}
    </article>
  );
}

/** Live-matching preview of a Hero Media banner slide */
export function HeroBannerItemCard({ item, preview = false }) {
  const title = itemTitle(item) || item?.title || "";
  const subtitle = item?.subtitle || item?.body || "";
  const bgUrl = mediaUrl(item?.image_url || "");
  const bgValue = item?.bg_color || "";
  const buttons = Array.isArray(item?.buttons) ? item.buttons : [];
  const sideImg = mediaUrl(item?.icon || "");
  const hasSide = Boolean(sideImg) || preview;
  const hasVideo = Boolean(String(item?.href || "").trim());

  return (
    <div
      className="relative min-h-[14rem] overflow-hidden rounded-xl text-white sm:min-h-[16rem]"
      style={bannerBgStyle(bgValue)}
    >
      {bgUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={bannerOverlayStyle(bgValue, { hasImage: true })}
            aria-hidden
          />
        </>
      ) : null}

      {hasSide ? (
        <div className="absolute inset-y-0 right-0 z-[1] w-[46%] max-sm:hidden">
          {sideImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sideImg}
              alt={mediaAlt(item, "Hero banner media")}
              className="absolute inset-0 size-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border-l border-dashed border-white/30 bg-white/5 text-[11px] text-white/45 italic">
              Side image…
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/35 to-transparent"
            aria-hidden
          />
          {hasVideo && sideImg ? (
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-ink shadow">
                <svg
                  className="size-5 translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
                </svg>
              </span>
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className={`relative z-[2] flex min-h-[14rem] flex-col justify-end gap-3 p-5 sm:min-h-[16rem] sm:p-6 ${
          hasSide ? "sm:pr-[50%]" : ""
        }`}
      >
        <h3 className="m-0 text-xl leading-tight font-bold tracking-tight text-white sm:text-2xl">
          {title ||
            (preview ? (
              <span className="text-white/40 italic">Add slide title…</span>
            ) : null)}
        </h3>
        {subtitle || preview ? (
          <p className="m-0 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-[15px]">
            {subtitle ||
              (preview ? (
                <span className="text-white/40 italic">Add subtitle…</span>
              ) : null)}
          </p>
        ) : null}
        {buttons.length ? (
          <div className="mt-1">
            <SectionButtons
              buttons={buttons}
              inverted
              className="flex flex-wrap items-center gap-2"
            />
          </div>
        ) : preview ? (
          <p className="m-0 text-xs text-white/45 italic">Add slide buttons…</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Dispatch by SECTION_ITEMS_CONFIG.preview key.
 * One card component for live page + CMS editor preview.
 */
export default function SectionItemCard({
  type,
  item,
  preview = false,
  className,
  index = 0,
}) {
  if (!item && !preview) return null;

  switch (type) {
    case "faq":
      return <FaqItemCard item={item} preview={preview} index={index} />;
    case "benefit":
      return <BenefitItemCard item={item} preview={preview} />;
    case "why_choose":
      return (
        <WhyChooseItemCard item={item} preview={preview} index={index} />
      );
    case "stat":
      if (preview) {
        return (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <StatItemCard item={item} preview className={className} />
          </div>
        );
      }
      return (
        <StatItemCard item={item} preview={preview} className={className} />
      );
    case "testimonial":
      return <TestimonialItemCard item={item} preview={preview} />;
    case "customer_testimonial":
      return <CustomerTestimonialItemCard item={item} preview={preview} />;
    case "resource":
      return <ResourceItemCard item={item} preview={preview} />;
    case "text_media":
      return <TextMediaItemCard item={item} preview={preview} />;
    case "curriculum":
      return <CurriculumItemCard item={item} preview={preview} />;
    case "hero_banner":
      return <HeroBannerItemCard item={item} preview={preview} />;
    case "training_option":
      return <TrainingOptionCard item={item} preview={preview} />;
    case "award":
      return <AwardCard item={item} preview={preview} />;
    case "partner": {
      const src = mediaUrl(item?.image_url || item?.icon || "");
      const name = itemTitle(item) || item?.title || "";
      return (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={mediaAlt(item, "Partner logo")}
              className="h-10 w-28 object-contain"
            />
          ) : preview ? (
            <span className="text-xs text-slate-400 italic">Logo…</span>
          ) : null}
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {name || (preview ? <Placeholder>Partner name…</Placeholder> : null)}
          </span>
        </div>
      );
    }
    default:
      return (
        <div className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">
          {itemTitle(item) || "Item"}
        </div>
      );
  }
}
