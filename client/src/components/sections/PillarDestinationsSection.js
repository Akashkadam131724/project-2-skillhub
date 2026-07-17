"use client";

import { useEffect, useRef, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

function Pillar({ item, index, visible }) {
  const photo = mediaUrl(item.image_url);
  const href = item.href || "";
  const delay = Math.min(index, 5) * 90;
  const inner = (
    <>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={mediaAlt(item, "Destination")}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--ink)_0%,var(--brand)_100%)]" />
      )}
      <div className="absolute inset-0 bg-ink/55 transition duration-500 group-hover:bg-ink/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative z-[1] flex h-full w-full flex-col justify-end p-6 sm:p-8">
        <p className="m-0 mb-3 font-[family-name:var(--font-display)] text-5xl font-semibold text-white/25 sm:text-6xl">
          {String(index + 1).padStart(2, "0")}
        </p>
        {item.title ? (
          <h3 className="m-0 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {item.title}
          </h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-2 mb-0 text-sm font-medium text-white/70">
            {item.subtitle}
          </p>
        ) : null}
        {!isRichTextEmpty(item.body) ? (
          <CmsRichText
            html={item.body}
            className="mt-3 text-sm leading-relaxed text-white/65"
          />
        ) : null}
        {href ? (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Explore
            <svg className="size-4 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : null}
      </div>
    </>
  );

  const className = `group relative flex h-full min-h-[22rem] overflow-hidden rounded-[1.75rem] transition duration-700 ease-out sm:min-h-[440px] ${
    visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {inner}
      </a>
    );
  }

  return (
    <article className={className} style={{ transitionDelay: `${delay}ms` }}>
      {inner}
    </article>
  );
}

/**
 * Tall destination pillars with hover image lift — modern link destinations.
 */
export default function PillarDestinationsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "pillar_destinations",
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
    <div ref={ref} className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_50%)] dark:bg-none">
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
          <MobileCardPeekRow
            gridFrom="md"
            gapClassName="gap-4 lg:gap-5"
            gridClassName="md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <Pillar
                key={item._id || item.id || i}
                item={item}
                index={i}
                visible={visible}
              />
            ))}
          </MobileCardPeekRow>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
