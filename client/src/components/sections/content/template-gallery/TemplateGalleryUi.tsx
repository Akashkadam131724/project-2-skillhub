import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TemplateGalleryUiProps } from "./lib/types";

export default function TemplateGalleryUi({
  id,
  title,
  subtitle,
  items = [],
  titleSlot,
  subtitleSlot,
  itemsBar = null,
  emptyState = null,
}: TemplateGalleryUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = showTitle || showSubtitle;

  return (
    <div
      id={id || undefined}
      className="bg-[#f4efe8] text-[#111] dark:bg-slate-950 dark:text-white"
    >
      <SectionWrapper className="py-14 sm:py-16 lg:py-20">
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
          <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className={item.large ? "md:col-span-2" : ""}
              >
                <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-white/10">
                  <div
                    className={`relative overflow-hidden bg-slate-200 ${
                      item.large ? "aspect-[16/9]" : "aspect-[4/5]"
                    }`}
                  >
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={mediaAlt(item, "Template")}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#ded6c8,#aab8a4)]" />
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    {item.category ? (
                      <p className="m-0 mb-2 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                        {item.category}
                      </p>
                    ) : null}
                    {item.title ? (
                      <h3 className="section-theme-heading m-0 text-xl font-semibold tracking-tight">
                        {item.title}
                      </h3>
                    ) : null}
                    {item.subtitle ? (
                      <p className="mt-2 mb-0 text-sm text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>
                    ) : null}
                    {!isRichTextEmpty(item.body) ? (
                      <CmsRichText
                        html={item.body}
                        className="section-theme-muted mt-3 text-sm"
                      />
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          emptyState
        )}
      </SectionWrapper>
    </div>
  );
}
