"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * SaaS pricing tiers — 3-up with featured middle plan (2026 landing standard).
 * Item fields: title (plan), value (price), subtitle (period), body (features html),
 * label ("popular" to highlight), href (CTA url via buttons on item or href).
 */
export default function PricingTiersSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "pricing_tiers",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] dark:bg-none">
      <SectionFrame
        title={section_title}
        subtitle={sub_title}
        cmsMode={cmsMode}
        onEditField={onEditField}
        buttons={buttons}
        button_title={button_title}
        target_url={target_url}
        onFormOpen={onFormOpen}
        {...frameProps}
      >
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
        />
        {items.length ? (
          <ul className="m-0 mx-auto grid max-w-5xl list-none gap-4 p-0 lg:grid-cols-3 lg:items-stretch lg:gap-5">
            {items.map((item, i) => {
              const featured =
                String(item.label || "").toLowerCase() === "popular" ||
                String(item.value || "").toLowerCase().includes("popular") ||
                i === 1;
              const features = String(item.body || "")
                .replace(/<\/?p>/gi, "")
                .split(/<br\s*\/?>|[\n•]/)
                .map((s) => s.replace(/<[^>]+>/g, "").trim())
                .filter(Boolean);

              return (
                <li key={item._id || item.id || i} className="min-w-0">
                  <article
                    className={`flex h-full flex-col rounded-[1.5rem] border p-6 sm:p-7 ${
                      featured
                        ? "border-ink bg-ink text-white shadow-xl dark:border-brand dark:bg-brand"
                        : "border-slate-200 bg-white text-ink dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    }`}
                  >
                    {featured ? (
                      <span className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                        Most popular
                      </span>
                    ) : (
                      <span className="mb-3 inline-flex h-[22px]" />
                    )}
                    {item.title ? (
                      <h3 className="m-0 text-lg font-semibold tracking-tight">
                        {item.title}
                      </h3>
                    ) : null}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
                        {item.value || "—"}
                      </span>
                      {item.subtitle ? (
                        <span
                          className={`text-sm ${
                            featured ? "text-white/65" : "text-slate-500"
                          }`}
                        >
                          {item.subtitle}
                        </span>
                      ) : null}
                    </div>
                    {!isRichTextEmpty(item.body) && features.length === 0 ? (
                      <CmsRichText
                        html={item.body}
                        className={`mt-4 text-sm ${
                          featured ? "text-white/75" : "text-slate-600"
                        }`}
                      />
                    ) : null}
                    {features.length ? (
                      <ul className="mt-6 mb-0 flex flex-1 list-none flex-col gap-2.5 p-0">
                        {features.map((f, fi) => (
                          <li
                            key={fi}
                            className={`flex items-start gap-2 text-sm ${
                              featured
                                ? "text-white/85"
                                : "text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            <svg
                              className="mt-0.5 size-4 shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              aria-hidden
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-1" />
                    )}
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`mt-8 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          featured
                            ? "bg-white text-ink hover:bg-white/90"
                            : "bg-ink text-white hover:bg-ink/90 dark:bg-white dark:text-ink"
                        }`}
                      >
                        {item.icon || "Get started"}
                      </a>
                    ) : null}
                    {Array.isArray(item.buttons) && item.buttons.length ? (
                      <SectionButtonsFooter
                        buttons={item.buttons}
                        cmsMode={false}
                        className="mt-8"
                        inverted={featured}
                      />
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
