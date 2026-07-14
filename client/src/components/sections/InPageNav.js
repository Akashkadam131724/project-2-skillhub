"use client";

import { useEffect, useMemo, useState } from "react";
import SectionWrapper from "./SectionWrapper";

function navLabel(section) {
  if (!section || section.section_key === "in_page_nav") return null;
  const title = (section.in_page_nav_title || "").trim();
  if (title) return title;
  const fallback = (section.section_title || "").trim();
  return fallback || null;
}

/**
 * Sticky in-page nav — scrolls to `cms-section-{placement_id}`.
 * `sections` should already be filtered to only those *below* the nav placement.
 * Labels come from each section's in_page_nav_title (or section_title).
 */
export default function InPageNav({ sections = [], cmsMode = false }) {
  const items = useMemo(
    () =>
      (sections || [])
        .map((section) => {
          const label = navLabel(section);
          if (!label) return null;
          const id =
            section.placement_id ||
            section.page_tag_id ||
            section.entity_override_id;
          if (!id) return null;
          return {
            id: String(id),
            label,
            targetId: `cms-section-${id}`,
          };
        })
        .filter(Boolean),
    [sections]
  );

  const [activeId, setActiveId] = useState(items[0]?.id || null);

  useEffect(() => {
    setActiveId(items[0]?.id || null);
  }, [items]);

  useEffect(() => {
    if (!items.length) return undefined;

    const nodes = items
      .map((item) => document.getElementById(item.targetId))
      .filter(Boolean);

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          const match = items.find((i) => i.targetId === visible[0].target.id);
          if (match) setActiveId(match.id);
        }
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) {
    if (!cmsMode) return null;
    return (
      <nav
        aria-label="On this page"
        className="sticky top-[68px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95"
      >
        <SectionWrapper className="py-3">
          <p className="m-0 text-xs text-slate-400 italic">
            No nav links yet — add in-page nav titles on sections below.
          </p>
        </SectionWrapper>
      </nav>
    );
  }

  if (items.length < 2 && !cmsMode) return null;

  function scrollTo(targetId) {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[68px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95"
    >
      <SectionWrapper className="py-0">
        <ul className="m-0 -mb-px flex list-none gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => {
            const active = item.id === activeId;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    scrollTo(item.targetId);
                  }}
                  className={`inline-flex items-center border-b-2 py-3 text-sm font-medium transition ${
                    index === 0 ? "pl-0 pr-4" : "px-4"
                  } ${
                    active
                      ? "border-brand text-brand"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-ink dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </SectionWrapper>
    </nav>
  );
}
