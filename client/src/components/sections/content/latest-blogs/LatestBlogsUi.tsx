import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type { LatestBlogsUiProps } from "./lib/types";

export default function LatestBlogsUi({
  id,
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  action,
  children,
}: LatestBlogsUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(showTitle || showSubtitle || action);

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20"
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
              children ? "mb-8 sm:mb-10" : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                From the journal
              </p>
              {titleSlot != null ? (
                titleSlot
              ) : showTitle ? (
                <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                  {title}
                </h2>
              ) : null}
              {subtitleSlot != null ? (
                subtitleSlot
              ) : showSubtitle ? (
                <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {action ?? (
              <Link
                href="/blogs"
                className="section-theme-heading inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold no-underline transition hover:border-brand hover:text-brand"
              >
                View all insights <span aria-hidden>→</span>
              </Link>
            )}
          </header>
        ) : null}
        {children}
      </SectionWrapper>
    </section>
  );
}
