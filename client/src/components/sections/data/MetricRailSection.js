"use client";

import { useEffect, useRef, useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import { resolveItemsForSection } from "@/lib/sections/item-types";

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
      { threshold: 0.3 }
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
        buttonsFooter={false}
        {...frameProps}
      >
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
                <p className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight section-theme-heading sm:text-4xl">
                  {item.value || "—"}
                </p>
                <p className="section-theme-muted mt-1 mb-0 text-sm">
                  {item.label || item.title || item.subtitle || ""}
                </p>
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
