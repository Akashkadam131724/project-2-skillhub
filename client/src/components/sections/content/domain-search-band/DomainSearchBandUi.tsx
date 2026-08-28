import SectionWrapper from "@/components/sections/SectionWrapper";
import type { DomainSearchBandUiProps } from "./lib/types";

export default function DomainSearchBandUi({
  id,
  title,
  subtitle,
  domain = "yourbrand.com",
  items = [],
  titleSlot,
  subtitleSlot,
  itemsBar = null,
  emptyState = null,
  footer = null,
}: DomainSearchBandUiProps) {
  return (
    <section
      id={id || undefined}
      className="bg-[#10100e] py-12 text-white sm:py-16"
    >
      <SectionWrapper>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            {titleSlot ??
              (title ? (
                <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {title}
                </h2>
              ) : null)}
            {subtitleSlot ??
              (subtitle ? (
                <p className="mt-3 mb-0 max-w-md text-base text-white/65">
                  {subtitle}
                </p>
              ) : null)}
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[1.5rem] bg-white p-3 text-ink shadow-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <span className="text-slate-400">https://</span>
                <span className="min-w-0 flex-1 truncate text-lg font-semibold">
                  {domain}
                </span>
                <span className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                  Search
                </span>
              </div>
              {items.length ? (
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              ) : (
                emptyState
              )}
            </div>
            {itemsBar}
          </div>
        </div>
        {footer}
      </SectionWrapper>
    </section>
  );
}
