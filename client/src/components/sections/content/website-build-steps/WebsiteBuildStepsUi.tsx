import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { WebsiteBuildStepsUiProps } from "./lib/types";

export default function WebsiteBuildStepsUi({
  id,
  title,
  subtitle,
  items = [],
  titleSlot,
  subtitleSlot,
  itemsBar = null,
  emptyState = null,
}: WebsiteBuildStepsUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = showTitle || showSubtitle;

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20"
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-2.5 sm:gap-3 ${
              items.length || itemsBar || emptyState ? "mb-8 sm:mb-10" : ""
            }`}
          >
            {titleSlot ??
              (title ? (
                <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                  {title}
                </h2>
              ) : null)}
            {subtitleSlot ??
              (subtitle ? (
                <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                  {subtitle}
                </p>
              ) : null)}
          </header>
        ) : null}

        {itemsBar}

        {items.length ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-[1.75rem] bg-[#111] p-6 text-white sm:p-8">
                <p className="m-0 text-xs font-semibold tracking-[0.24em] text-white/45 uppercase">
                  Build flow
                </p>
                <p className="mt-5 mb-0 font-[family-name:var(--font-display)] text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
                  From idea to live site.
                </p>
                <div className="mt-8 grid gap-3">
                  <div className="h-20 rounded-2xl bg-white/10" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-2xl bg-white/15" />
                    <div className="h-24 rounded-2xl bg-brand/70" />
                  </div>
                  <div className="h-3 w-2/3 rounded-full bg-white/20" />
                  <div className="h-3 w-1/2 rounded-full bg-white/15" />
                </div>
              </div>
            </div>
            <ol className="m-0 list-none p-0 lg:col-span-7">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-t border-slate-200 py-7 first:border-t-0 first:pt-0 dark:border-slate-800"
                >
                  <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
                    <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-semibold text-slate-300 dark:text-slate-700">
                      {String(item.index).padStart(2, "0")}
                    </p>
                    <div>
                      {item.title ? (
                        <h3 className="section-theme-heading m-0 text-xl font-semibold tracking-tight">
                          {item.title}
                        </h3>
                      ) : null}
                      {item.subtitle ? (
                        <p className="mt-1 mb-0 text-sm font-medium text-brand">
                          {item.subtitle}
                        </p>
                      ) : null}
                      {!isRichTextEmpty(item.body) ? (
                        <CmsRichText
                          html={item.body}
                          className="section-theme-muted mt-3 text-[15px] leading-relaxed"
                        />
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          emptyState
        )}
      </SectionWrapper>
    </section>
  );
}
