"use client";

import InPageNav from "@/components/sections/InPageNav";

/**
 * Global placement for sticky in-page navigation.
 * Nav links are built from sections *below* this placement that have
 * `in_page_nav_title` (or section_title). Sections above are skipped.
 *
 * Important: do not wrap the sticky <nav> in a short parent — sticky is
 * limited to its containing block height.
 */
export default function InPageNavSection({
  navSections = [],
  cmsMode = false,
  section_key = "in_page_nav",
}) {
  return (
    <>
      {cmsMode ? (
        <div
          data-section-key={section_key}
          className="border-b border-dashed border-sky-200 bg-sky-50 px-4 py-2 text-[11px] text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200"
        >
          In-page nav (global) — links are built from sections{" "}
          <span className="font-semibold">below</span> this block that have an
          in-page nav title. Sections above are skipped.
        </div>
      ) : null}
      <InPageNav sections={navSections} cmsMode={cmsMode} />
    </>
  );
}
