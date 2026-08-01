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
import StarSparkleIcon from "@/components/icons/StarSparkleIcon";

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
                  className={`mb-4 break-inside-avoid list-none transition duration-700 ${visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                    }`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <article
                    data-section-surface="light-card"
                    data-light-surface=""
                    className="section-light-card rounded-2xl section-ui-card border p-5 shadow-sm"
                  >
                    <div className="mb-3 flex gap-0.5 text-brand" aria-hidden>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <StarSparkleIcon key={s} />
                      ))}
                    </div>
                    {!isRichTextEmpty(item.body) ? (
                      <CmsRichText
                        html={item.body}
                        className="section-theme-muted text-[15px] leading-relaxed"
                      />
                    ) : item.title ? (
                      <p className="section-theme-muted m-0 text-[15px] leading-relaxed">
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
                        <p className="m-0 truncate text-sm font-semibold section-theme-heading">
                          {item.subtitle || item.label || "Customer"}
                        </p>
                        {item.value ? (
                          <p className="section-theme-subtle m-0 truncate text-xs">
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
