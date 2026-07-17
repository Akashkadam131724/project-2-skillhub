"use client";

import { useEffect, useRef, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { resolveItemsForSection } from "@/lib/item-types";

/**
 * Metric rail — social-proof numbers strip (logo-bar alternative from SaaS kits).
 */
export default function MetricRailSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "metric_rail",
  cmsMode,
  onEditField,
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
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!items.length && !cmsMode) return null;

  return (
    <section
      ref={ref}
      className="border-y border-slate-200 bg-white py-10 sm:py-12 dark:border-slate-800 dark:bg-slate-950"
    >
      <SectionWrapper>
        {(section_title || sub_title || cmsMode) && (
          <header className="mb-8 text-center">
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
              className="justify-center"
            >
              {section_title || cmsMode ? (
                <p className="m-0 text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  {section_title || "Proof"}
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
          <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-4 sm:gap-8">
            {items.map((item, i) => (
              <li
                key={item._id || item.id || i}
                className={`text-center transition duration-700 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
                  {item.value || "—"}
                </p>
                <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
                  {item.label || item.title || item.subtitle || ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionWrapper>
    </section>
  );
}
