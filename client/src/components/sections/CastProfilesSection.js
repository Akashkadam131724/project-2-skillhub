"use client";

import { useEffect, useRef, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

function ProfileCard({ item, index, featured = false, visible }) {
  const photo = mediaUrl(item.image_url);
  const name = item.title || "";
  const character = item.subtitle || "";
  const badge = item.value || "";
  const bio = item.body || "";
  const delay = Math.min(index, 10) * 55;

  return (
    <article
      className={`group flex h-full flex-col transition duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative h-80 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-900 shadow-lg ring-1 ring-black/10 sm:aspect-[3/4] sm:h-auto">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name ? `${name} as ${character || "cast"}` : "Cast member"}
            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Photo
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
          aria-hidden
        />
        {badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-ink uppercase shadow">
            {badge}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
          {name ? (
            <h3
              className={`m-0 font-[family-name:var(--font-display)] font-semibold tracking-tight text-white ${
                featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
              }`}
            >
              {name}
            </h3>
          ) : null}
          {character ? (
            <p className="mt-1 mb-0 text-sm font-semibold text-white/75">
              as {character}
            </p>
          ) : null}
        </div>
      </div>
      {!isRichTextEmpty(bio) ? (
        <CmsRichText
          html={bio}
          className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        />
      ) : null}
    </article>
  );
}

/**
 * Cast / talent profiles — cinematic portrait stills from the film.
 */
export default function CastProfilesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "cast_profiles",
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
      { threshold: 0.1 }
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
          <MobileCardPeekRow
            gapClassName="gap-4 sm:gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((item, i) => (
              <ProfileCard
                key={item._id || item.id || i}
                item={item}
                index={i}
                featured={i === 0}
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
