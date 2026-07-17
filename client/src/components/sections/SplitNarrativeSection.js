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
 * Sticky media + scrolling narrative chapters — modern story layout.
 */
export default function SplitNarrativeSection({
  section_title,
  sub_title,
  section_img_url,
  items: mappingItems,
  section_key = "split_narrative",
  cmsMode,
  onEditField,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const [active, setActive] = useState(0);
  const chapterRefs = useRef([]);
  const cover = mediaUrl(section_img_url || items[active]?.image_url || items[0]?.image_url);

  useEffect(() => {
    const nodes = chapterRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = nodes.indexOf(visible.target);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.2, 0.5, 0.8] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  if (!items.length && !cmsMode) return null;

  const activePhoto = mediaUrl(items[active]?.image_url) || cover;

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 dark:bg-slate-950">
      <SectionWrapper>
        {(section_title || sub_title || cmsMode) && (
          <header className="mb-10 max-w-3xl sm:mb-14">
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title || cmsMode ? (
                <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
                  {section_title || "Story"}
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
                <p className="mt-3 mb-0 text-base text-slate-600 dark:text-slate-300">
                  {sub_title || "Subtitle"}
                </p>
              ) : null}
            </CmsEditable>
          </header>
        )}

        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
        />

        {items.length ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="sticky top-28 overflow-hidden rounded-[1.75rem] bg-ink">
                <div className="relative aspect-[4/5] w-full">
                  {activePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={activePhoto}
                      src={activePhoto}
                      alt={mediaAlt(items[active], "Chapter")}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--ink),var(--brand))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <div className="absolute right-5 bottom-5 left-5">
                    <p className="m-0 text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                      Chapter {String(active + 1).padStart(2, "0")}
                    </p>
                    {items[active]?.title ? (
                      <p className="mt-2 mb-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                        {items[active].title}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <ol className="m-0 flex list-none flex-col gap-10 p-0 lg:col-span-7 lg:gap-16 lg:py-6">
              {items.map((item, i) => {
                const photo = mediaUrl(item.image_url);
                return (
                  <li
                    key={item._id || item.id || i}
                    ref={(el) => {
                      chapterRefs.current[i] = el;
                    }}
                    className={`transition duration-500 ${
                      active === i ? "opacity-100" : "opacity-55 lg:opacity-40"
                    }`}
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={mediaAlt(item, "Chapter")}
                        className="mb-5 aspect-[16/10] w-full rounded-2xl object-cover lg:hidden"
                      />
                    ) : null}
                    <p className="m-0 mb-3 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                      {item.value || String(i + 1).padStart(2, "0")}
                    </p>
                    {item.title ? (
                      <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-white">
                        {item.title}
                      </h3>
                    ) : null}
                    {item.subtitle ? (
                      <p className="mt-2 mb-0 text-base font-medium text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>
                    ) : null}
                    {!isRichTextEmpty(item.body) ? (
                      <CmsRichText
                        html={item.body}
                        className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300"
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionWrapper>
    </section>
  );
}
