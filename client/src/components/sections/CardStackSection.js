"use client";

import { useEffect, useRef, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Sticky card stack on scroll — Awwwards / Codrops pattern (CSS sticky, no GSAP).
 */
export default function CardStackSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "card_stack",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const [active, setActive] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = nodes.indexOf(top.target);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.25, 0.5, 0.75] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  if (!items.length && !cmsMode) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <SectionFrame
        title={section_title}
        subtitle={sub_title}
        cmsMode={cmsMode}
        onEditField={onEditField}
        {...frameProps}
      >
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
        />
        {items.length ? (
          <div className="relative mx-auto max-w-3xl pb-8">
            <ul className="m-0 list-none p-0">
              {items.map((item, i) => {
                const photo = mediaUrl(item.image_url);
                const scale = 1 - Math.max(0, active - i) * 0.04;
                const isPast = i < active;
                return (
                  <li
                    key={item._id || item.id || i}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="sticky top-24 mb-6 sm:top-28 sm:mb-8"
                    style={{ zIndex: i + 1 }}
                  >
                    <article
                      className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_60px_-28px_rgba(11,31,77,0.35)] transition duration-500 dark:border-slate-800 dark:bg-slate-900"
                      style={{
                        transform: `scale(${Math.max(scale, 0.88)})`,
                        opacity: isPast ? 0.85 : 1,
                      }}
                    >
                      <div className="grid sm:grid-cols-5">
                        <div className="relative aspect-[4/3] sm:col-span-2 sm:aspect-auto sm:min-h-[280px]">
                          {photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photo}
                              alt={mediaAlt(item, "Card")}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--ink),var(--brand))]" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center p-6 sm:col-span-3 sm:p-8">
                          <p className="m-0 mb-2 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                            {item.value || String(i + 1).padStart(2, "0")}
                          </p>
                          {item.title ? (
                            <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-white">
                              {item.title}
                            </h3>
                          ) : null}
                          {item.subtitle ? (
                            <p className="mt-2 mb-0 text-sm font-medium text-slate-500 dark:text-slate-400">
                              {item.subtitle}
                            </p>
                          ) : null}
                          {!isRichTextEmpty(item.body) ? (
                            <CmsRichText
                              html={item.body}
                              className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300"
                            />
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
