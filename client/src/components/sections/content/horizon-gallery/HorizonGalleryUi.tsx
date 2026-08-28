"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { HorizonGalleryUiProps } from "./lib/types";

export default function HorizonGalleryUi({
  id,
  title,
  subtitle,
  items = [],
  titleSlot,
  subtitleSlot,
  itemsBar = null,
  emptyState = null,
}: HorizonGalleryUiProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  function go(dir: number) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  const showHeader = Boolean(titleSlot || subtitleSlot || title || subtitle);

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden bg-ink py-12 text-white sm:py-16"
    >
      <SectionWrapper>
        {showHeader ? (
          <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {titleSlot ??
                (title ? (
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {title}
                  </h2>
                ) : null)}
              {subtitleSlot ??
                (subtitle ? (
                  <p className="mt-3 mb-0 text-base text-white/65">{subtitle}</p>
                ) : null)}
            </div>
            {items.length > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/15"
                  aria-label="Previous"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/15"
                  aria-label="Next"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            ) : null}
          </header>
        ) : null}

        {itemsBar}
      </SectionWrapper>

      {items.length ? (
        <>
          <div
            ref={scroller}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, i) => (
              <article
                key={item.id}
                className="relative h-[58vh] min-w-full shrink-0 snap-center overflow-hidden sm:h-[68vh]"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
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
            ))}
          </div>
          {items.length > 1 ? (
            <div className="mt-6 flex justify-center gap-2">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    const el = scroller.current;
                    if (el) {
                      el.scrollTo({
                        left: i * el.clientWidth,
                        behavior: "smooth",
                      });
                    }
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
        <SectionWrapper>{emptyState}</SectionWrapper>
      )}
    </section>
  );
}
