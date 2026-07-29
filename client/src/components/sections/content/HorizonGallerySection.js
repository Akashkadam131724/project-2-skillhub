"use client";

import { useEffect, useRef, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Cinematic horizontal snap gallery — full-bleed image panels with captions.
 */
export default function HorizonGallerySection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "horizon_gallery",
  cmsMode,
  onEditField,
}) {
  const scroller = useRef(null);
  const [active, setActive] = useState(0);
  const items = resolveItemsForSection(section_key, mappingItems);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;
    const onScroll = () => {
      const w = el.clientWidth || 1;
      setActive(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  if (!items.length && !cmsMode) return null;

  function go(dir) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  return (
    <section className="relative w-full overflow-hidden bg-ink py-12 text-white sm:py-16">
      <SectionWrapper>
        {(section_title || sub_title || cmsMode) && (
          <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
              >
                {section_title || cmsMode ? (
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {section_title || "Gallery"}
                  </h2>
                ) : null}
              </CmsEditable>
              <CmsEditable
                cmsMode={cmsMode}
                field="sub_title"
                label="Subtitle"
                onEditField={onEditField}
              >
                {sub_title || cmsMode ? (
                  <p className="mt-3 mb-0 text-base text-white/65">
                    {sub_title || "Subtitle"}
                  </p>
                ) : null}
              </CmsEditable>
            </div>
            {items.length > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/15"
                  aria-label="Previous"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/15"
                  aria-label="Next"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ) : null}
          </header>
        )}

        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
          className="mb-6 [&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white"
        />
      </SectionWrapper>

      {items.length ? (
        <>
          <div
            ref={scroller}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, i) => {
              const photo = mediaUrl(item.image_url);
              return (
                <article
                  key={item._id || item.id || i}
                  className="relative h-[58vh] min-w-full shrink-0 snap-center overflow-hidden sm:h-[68vh]"
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={mediaAlt(item, "Gallery slide")}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--ink),var(--brand))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
                    <p className="m-0 mb-2 text-xs font-semibold tracking-[0.22em] text-white/50 uppercase">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(items.length).padStart(2, "0")}
                    </p>
                    {item.title ? (
                      <h3 className="m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {item.title}
                      </h3>
                    ) : null}
                    {item.subtitle ? (
                      <p className="mt-3 mb-0 max-w-xl text-base text-white/75">
                        {item.subtitle}
                      </p>
                    ) : null}
                    {!isRichTextEmpty(item.body) ? (
                      <CmsRichText
                        html={item.body}
                        className="mt-3 max-w-lg text-sm text-white/60"
                      />
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          {items.length > 1 ? (
            <div className="mt-6 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    const el = scroller.current;
                    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    active === i ? "w-8 bg-white" : "w-2 bg-white/35"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <SectionWrapper>
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        </SectionWrapper>
      )}
    </section>
  );
}
