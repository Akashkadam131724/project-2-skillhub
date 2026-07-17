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

const SPAN = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
];

function BentoCell({ item, index, visible }) {
  const photo = mediaUrl(item.image_url);
  const delay = Math.min(index, 6) * 70;
  const isHero = index % 6 === 0;

  return (
    <article
      className={`group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 text-white transition duration-700 ease-out dark:border-slate-800 ${
        isHero ? "sm:min-h-[420px]" : "sm:min-h-[220px]"
      } ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={mediaAlt(item, "Bento item")}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--ink),var(--brand))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <div className={`relative z-[1] p-5 sm:p-6 ${isHero ? "sm:p-8" : ""}`}>
        {item.value ? (
          <p
            className={`m-0 mb-2 font-[family-name:var(--font-display)] font-semibold tracking-tight text-white ${
              isHero ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {item.value}
          </p>
        ) : null}
        {item.title ? (
          <h3
            className={`m-0 font-semibold tracking-tight text-white ${
              isHero ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            {item.title}
          </h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-1 mb-0 text-sm text-white/65">{item.subtitle}</p>
        ) : null}
        {!isRichTextEmpty(item.body) ? (
          <CmsRichText
            html={item.body}
            className="mt-3 max-w-md text-sm leading-relaxed text-white/70"
          />
        ) : null}
      </div>
    </article>
  );
}

/**
 * Modern asymmetric bento mosaic — mixed spans, image cells, metrics.
 */
export default function BentoGridSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "bento_grid",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const items = resolveItemsForSection(section_key, mappingItems);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!items.length && !cmsMode) return null;

  return (
    <div ref={ref}>
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
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:grid-flow-dense lg:grid-cols-4 lg:gap-4">
            {items.map((item, i) => (
              <li
                key={item._id || item.id || i}
                className={SPAN[i % SPAN.length]}
              >
                <BentoCell item={item} index={i} visible={visible} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
