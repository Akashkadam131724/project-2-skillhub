"use client";

import { useEffect, useState } from "react";
import { mediaUrl } from "@/lib/cms-api";
import { resolveItemsForSection, itemTitle } from "@/lib/item-types";
import { bannerBgStyle, bannerOverlayStyle } from "@/lib/banner-bg";
import { isRichTextEmpty } from "@/lib/rich-text";
import CmsRichText from "@/components/cms/CmsRichText";
import CmsSectionItemsBar from "../CmsSectionItemsBar";
import EmptyItemsHint from "../EmptyItemsHint";
import SectionButtonsFooter from "../SectionButtonsFooter";
import SectionWrapper from "../SectionWrapper";
import HeroSlideSideMedia from "./HeroSlideSideMedia";

function SlideCopy({ item, cmsMode, onEditField, onFormOpen }) {
  const title = itemTitle(item) || item?.title || "";
  const subtitle = item?.subtitle || "";
  const body = item?.body || "";
  const buttons = Array.isArray(item?.buttons) ? item.buttons : [];

  return (
    <div className="flex min-w-0 max-w-2xl flex-col gap-4 lg:max-w-4xl">
      {title ? (
        <h1 className="m-0 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      ) : cmsMode ? (
        <h1 className="m-0 text-3xl font-bold text-white/40 italic sm:text-4xl">
          Add slide title…
        </h1>
      ) : null}
      {subtitle ? (
        <p className="m-0 text-base leading-relaxed text-slate-200 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
      {!isRichTextEmpty(body) ? (
        <CmsRichText
          html={body}
          className="text-base leading-relaxed text-slate-200 sm:text-lg [&_a]:text-white [&_a]:underline"
        />
      ) : null}
      <SectionButtonsFooter
        buttons={buttons}
        cmsMode={false}
        onEditField={onEditField}
        onFormOpen={onFormOpen}
        inverted
        className="mt-2"
      />
    </div>
  );
}

/**
 * Full-bleed media banner slider — each item is a banner
 * (bg image/color, copy, optional right-side cover image + video URL).
 */
export default function HeroMediaSection({
  items: mappingItems,
  section_key = "hero_media",
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const [index, setIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (cmsMode || items.length < 2 || videoOpen) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [cmsMode, items.length, videoOpen]);

  if (!items.length && !cmsMode) return null;

  const count = items.length;
  const current = count ? items[Math.min(index, count - 1)] : null;
  const bgUrl = current ? mediaUrl(current.image_url || "") : "";
  const bgValue = current?.bg_color || "";
  const hasSide =
    Boolean(current && mediaUrl(current.icon || "")) ||
    (cmsMode && Boolean(current));

  function go(delta) {
    if (!count) return;
    setIndex((i) => (i + delta + count) % count);
  }

  return (
    <section
      className="relative min-h-[22rem] overflow-hidden text-white sm:min-h-[28rem]"
      style={bannerBgStyle(bgValue)}
    >
      {bgUrl ? (
        <>
          <div
            key={bgUrl}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
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

      {current && hasSide ? (
        <HeroSlideSideMedia
          item={current}
          cmsMode={cmsMode}
          onVideoOpenChange={setVideoOpen}
        />
      ) : null}

      <SectionWrapper
        className={`relative z-[2] flex min-h-[22rem] flex-col justify-end py-12 sm:min-h-[28rem] sm:py-14 lg:py-16 ${
          hasSide ? "sm:pr-[42%] lg:pr-[38%]" : ""
        }`}
      >
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
          className="mb-6 [&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:text-white"
        />

        {current ? (
          <>
            <SlideCopy
              item={current}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
            />

            {count > 1 ? (
              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Previous banner"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-2" role="tablist">
                  {items.map((item, i) => (
                    <button
                      key={item._id || item.id || i}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Banner ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-2.5 rounded-full border-0 transition ${
                        i === index
                          ? "w-6 bg-white"
                          : "w-2.5 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(1)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Next banner"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-white/30 bg-white/5 p-6">
            <EmptyItemsHint
              sectionKey={section_key}
              onEditField={onEditField}
            />
          </div>
        )}
      </SectionWrapper>
    </section>
  );
}
