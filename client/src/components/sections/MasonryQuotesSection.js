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
 * Masonry quote wall — SaaS social proof pattern (volume of voice).
 */
export default function MasonryQuotesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "masonry_quotes",
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
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
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
          <ul className="m-0 columns-1 gap-4 p-0 sm:columns-2 lg:columns-3">
            {items.map((item, i) => {
              const photo = mediaUrl(item.image_url);
              const delay = Math.min(i, 8) * 60;
              return (
                <li
                  key={item._id || item.id || i}
                  className={`mb-4 break-inside-avoid list-none transition duration-700 ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex gap-0.5 text-brand" aria-hidden>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg
                          key={s}
                          className="size-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 1.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5L10 13.8 4.9 16.6l1.2-5.5L2 7.3l5.6-.6L10 1.5z" />
                        </svg>
                      ))}
                    </div>
                    {!isRichTextEmpty(item.body) ? (
                      <CmsRichText
                        html={item.body}
                        className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200"
                      />
                    ) : item.title ? (
                      <p className="m-0 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                        “{item.title}”
                      </p>
                    ) : null}
                    <div className="mt-5 flex items-center gap-3">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={mediaAlt(item, "Author")}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="inline-flex size-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                          {(item.subtitle || item.label || "?").slice(0, 1)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="m-0 truncate text-sm font-semibold text-ink dark:text-white">
                          {item.subtitle || item.label || "Customer"}
                        </p>
                        {item.value ? (
                          <p className="m-0 truncate text-xs text-slate-500">
                            {item.value}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
