import type { InPageNavCmsPreviewProps } from "./lib/types";

/** CMS inline preview banner — explains how in-page nav links are built. */
export default function InPageNavCmsPreview({
  sectionKey = "in_page_nav",
}: InPageNavCmsPreviewProps) {
  return (
    <div
      data-section-key={sectionKey}
      className="border-b border-dashed border-sky-200 bg-sky-50 px-4 py-2 text-[11px] text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200"
    >
      In-page nav (global) — links are built from sections{" "}
      <span className="font-semibold">below</span> this block that have an
      in-page nav title. Sections above are skipped.
    </div>
  );
}
