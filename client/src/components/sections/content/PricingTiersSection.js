"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionFrame from "@/components/sections/SectionFrame";
import SectionLightCard from "@/components/sections/design/SectionLightCard";
import CmsRichText from "@/components/cms/CmsRichText";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";
import {
  DS_CARD,
  DS_TEXT,
  isPlacementDarkBand,
} from "@/lib/section-theme";
import CheckIcon from "@/components/icons/CheckIcon";

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
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  const themePref = section_theme ?? sectionTheme;
  const darkBand = isPlacementDarkBand({
    sectionTheme: themePref,
    surfaceTone,
    surfaceBand,
  });

  function isFeaturedPlan(item, index) {
    const label = String(item.label || "").toLowerCase();
    if (label === "popular") return true;
    if (String(item.value || "").toLowerCase().includes("popular")) return true;
    return index === 1;
  }

  return (
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
              const featured = isFeaturedPlan(item, i);
              const features = String(item.body || "")
                .replace(/<\/?p>/gi, "")
                .split(/<br\s*\/?>|[\n•]/)
                .map((s) => s.replace(/<[^>]+>/g, "").trim())
                .filter(Boolean);

              if (featured) {
                const featuredShell = darkBand
                  ? "flex h-full flex-col rounded-[1.5rem] border border-white/20 bg-brand p-6 shadow-xl sm:p-7"
                  : "flex h-full flex-col rounded-[1.5rem] border border-ink bg-ink p-6 shadow-xl sm:p-7";

                return (
                  <li key={item._id || item.id || i} className="min-w-0">
                    <article
                      data-always-light-text=""
                      className={featuredShell}
                    >
                      <span className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                        Most popular
                      </span>
                      {item.title ? (
                        <h3
                          className={`m-0 text-lg font-semibold tracking-tight ${DS_TEXT.heading}`}
                        >
                          {item.title}
                        </h3>
                      ) : null}
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
                          {item.value || "—"}
                        </span>
                        {item.subtitle ? (
                          <span className={`text-sm ${DS_TEXT.muted}`}>
                            {item.subtitle}
                          </span>
                        ) : null}
                      </div>
                      {!isRichTextEmpty(item.body) && features.length === 0 ? (
                        <CmsRichText
                          html={item.body}
                          className={`mt-4 text-sm ${DS_TEXT.muted}`}
                        />
                      ) : null}
                      {features.length ? (
                        <ul className="mt-6 mb-0 flex flex-1 list-none flex-col gap-2.5 p-0">
                          {features.map((f, fi) => (
                            <li
                              key={fi}
                              className={`flex items-start gap-2 text-sm ${DS_TEXT.muted}`}
                            >
                              <CheckIcon className="mt-0.5 shrink-0" />
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
                          className="section-btn section-btn--inverse mt-8 rounded-xl px-4 py-3"
                        >
                          {item.icon || "Get started"}
                        </a>
                      ) : null}
                      {Array.isArray(item.buttons) && item.buttons.length ? (
                        <SectionButtonsFooter
                          buttons={item.buttons}
                          cmsMode={false}
                          className="mt-8"
                          inverted
                        />
                      ) : null}
                    </article>
                  </li>
                );
              }

              return (
                <li key={item._id || item.id || i} className="min-w-0">
                  <SectionLightCard
                    as="article"
                    className={`flex h-full flex-col rounded-[1.5rem] p-6 sm:p-7 ${DS_CARD.ui} shadow-sm`}
                  >
                    <span className="mb-3 inline-flex h-[22px]" aria-hidden />
                    {item.title ? (
                      <h3
                        className={`m-0 text-lg font-semibold tracking-tight ${DS_TEXT.heading}`}
                      >
                        {item.title}
                      </h3>
                    ) : null}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
                        {item.value || "—"}
                      </span>
                      {item.subtitle ? (
                        <span className={`text-sm ${DS_TEXT.muted}`}>
                          {item.subtitle}
                        </span>
                      ) : null}
                    </div>
                    {!isRichTextEmpty(item.body) && features.length === 0 ? (
                      <CmsRichText
                        html={item.body}
                        className={`mt-4 text-sm ${DS_TEXT.muted}`}
                      />
                    ) : null}
                    {features.length ? (
                      <ul className="mt-6 mb-0 flex flex-1 list-none flex-col gap-2.5 p-0">
                        {features.map((f, fi) => (
                          <li
                            key={fi}
                            className={`flex items-start gap-2 text-sm ${DS_TEXT.muted}`}
                          >
                            <CheckIcon className="mt-0.5 shrink-0 text-brand" />
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
                        className="section-btn section-btn--primary mt-8 rounded-xl px-4 py-3"
                      >
                        {item.icon || "Get started"}
                      </a>
                    ) : null}
                    {Array.isArray(item.buttons) && item.buttons.length ? (
                      <SectionButtonsFooter
                        buttons={item.buttons}
                        cmsMode={false}
                        className="mt-8"
                      />
                    ) : null}
                  </SectionLightCard>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
  );
}
