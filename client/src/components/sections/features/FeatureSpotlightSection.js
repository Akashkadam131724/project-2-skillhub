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

function SpotlightCard({ item, index, visible }) {
  const photo = mediaUrl(item.image_url);
  const delay = Math.min(index, 5) * 80;

  return (
    <article
      className={`group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white transition duration-700 ease-out dark:border-slate-800 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={mediaAlt(item, "Feature spotlight")}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#0b1f4d,#1b4de4)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
      <div className="relative z-[1] p-5 sm:p-6">
        {item.value ? (
          <p className="m-0 mb-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {item.value}
          </p>
        ) : null}
        {item.title ? (
          <h3 className="m-0 text-lg font-semibold tracking-tight text-white sm:text-xl">
            {item.title}
          </h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-1 mb-0 text-sm font-medium text-white/70">
            {item.subtitle}
          </p>
        ) : null}
        {!isRichTextEmpty(item.body) ? (
          <CmsRichText
            html={item.body}
            className="mt-3 text-sm leading-relaxed text-white/75"
          />
        ) : null}
      </div>
    </article>
  );
}

/**
 * Modern asymmetric spotlight grid — image cards with bold metrics/titles.
 */
export default function FeatureSpotlightSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "feature_spotlight",
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
      { threshold: 0.15 }
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
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:auto-rows-[minmax(260px,1fr)] lg:grid-cols-3 lg:auto-rows-[minmax(240px,1fr)] lg:gap-5">
            {items.map((item, i) => (
              <li
                key={item._id || item.id || i}
                className={`h-full ${
                  i === 0
                    ? "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
                    : ""
                }`}
              >
                <SpotlightCard
                  item={item}
                  index={i}
                  visible={visible}
                />
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
