"use client";

import { useEffect, useRef, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";
import {
  isSectionThemeDarkBand,
  SECTION_ITEM_MUTED_CLASS,
  SECTION_ITEM_TITLE_CLASS,
} from "@/lib/section-theme";

/**
 * Modern process / journey steps with a continuous ink rail.
 */
export default function ProcessStepsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "process_steps",
  sectionTheme,
  section_theme,
  surfaceTone,
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const items = resolveItemsForSection(section_key, mappingItems);
  const themePlacement = {
    section_theme: section_theme ?? sectionTheme,
  };
  const darkBand = isSectionThemeDarkBand(themePlacement);

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
          <ol className="relative m-0 grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              aria-hidden
              className={`pointer-events-none absolute top-7 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent to-transparent lg:block ${
                darkBand ? "via-white/25" : "via-slate-300 dark:via-slate-600"
              }`}
            />
            {items.map((item, i) => {
              const delay = Math.min(i, 6) * 90;
              return (
                <li
                  key={item._id || item.id || i}
                  className={`relative transition duration-700 ease-out ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-ink font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-slate-200 lg:hidden dark:bg-slate-800" />
                  </div>
                  {item.title ? (
                    <h3
                      className={`m-0 text-lg font-semibold tracking-tight ${SECTION_ITEM_TITLE_CLASS}`}
                    >
                      {item.title}
                    </h3>
                  ) : null}
                  {item.subtitle ? (
                    <p className="mt-1 mb-0 text-sm font-medium text-brand">
                      {item.subtitle}
                    </p>
                  ) : null}
                  {!isRichTextEmpty(item.body) ? (
                    <CmsRichText
                      html={item.body}
                      className={`mt-2 text-sm leading-relaxed ${SECTION_ITEM_MUTED_CLASS}`}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
