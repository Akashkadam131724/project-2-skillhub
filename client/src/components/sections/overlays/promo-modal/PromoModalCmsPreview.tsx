import SectionWrapper from "@/components/sections/SectionWrapper";
import type { PromoModalCmsPreviewProps } from "./lib/types";

/** CMS inline preview strip — not a real modal. */
export default function PromoModalCmsPreview({
  titleSlot,
  subtitleSlot,
  delayMs,
  storageKey,
  footer = null,
}: PromoModalCmsPreviewProps) {
  return (
    <section className="border-b border-dashed border-violet-200 bg-violet-50/80 py-8 dark:border-violet-900 dark:bg-violet-950/30">
      <SectionWrapper>
        <p className="m-0 text-[11px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
          Promo modal (overlay)
        </p>
        {titleSlot}
        {subtitleSlot}
        <p className="mt-3 text-xs text-slate-500">
          Opens after <strong>{delayMs}ms</strong> on the live page. Dismiss uses
          session key{" "}
          <code className="rounded bg-white/80 px-1 dark:bg-slate-900">
            {storageKey}
          </code>
          .
        </p>
        {footer}
      </SectionWrapper>
    </section>
  );
}
