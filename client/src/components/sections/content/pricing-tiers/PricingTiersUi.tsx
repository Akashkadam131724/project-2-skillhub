import { SectionLayoutRoot } from "@/components/sections/layout";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CheckIcon from "@/components/icons/CheckIcon";
import SectionLightCard from "@/components/sections/shared/design/SectionLightCard";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import DsButton from "@/components/ui/DsButton";
import SectionButtons from "@/components/ui/SectionButtons";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { PricingTierUiItem, PricingTiersUiProps } from "./lib/types";

function PricingTierCard({
  item,
  onDarkBand = false,
  preview = false,
}: {
  item: PricingTierUiItem;
  onDarkBand?: boolean;
  preview?: boolean;
}) {
  const featured = Boolean(item.featured);
  const features = item.features ?? [];
  const hasButtons = Array.isArray(item.buttons) && item.buttons.length > 0;

  if (featured) {
    const featuredShell = onDarkBand
      ? "flex h-full flex-col rounded-[1.5rem] border border-white/20 bg-brand p-6 shadow-xl sm:p-7"
      : "flex h-full flex-col rounded-[1.5rem] border border-ink bg-ink p-6 shadow-xl sm:p-7";

    return (
      <article data-always-light-text="" className={featuredShell}>
        <span className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
          Most popular
        </span>
        {item.title || preview ? (
          <h3
            className={`m-0 text-lg font-semibold tracking-tight ${DS_TEXT.heading}`}
          >
            {item.title ||
              (preview ? <CardPlaceholder>Plan name…</CardPlaceholder> : null)}
          </h3>
        ) : null}
        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
            {item.price ||
              (preview ? (
                <CardPlaceholder>$—</CardPlaceholder>
              ) : (
                "—"
              ))}
          </span>
          {item.period ? (
            <span className={`text-sm ${DS_TEXT.muted}`}>{item.period}</span>
          ) : null}
        </div>
        {!isRichTextEmpty(item.body) && features.length === 0 ? (
          <CmsRichText
            html={item.body}
            className={`mt-4 text-sm ${DS_TEXT.muted}`}
            empty={
              preview ? (
                <p className={`mt-4 mb-0 text-sm ${DS_TEXT.muted}`}>
                  <CardPlaceholder>Features…</CardPlaceholder>
                </p>
              ) : null
            }
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
          <DsButton
            label={item.ctaLabel || "Get started"}
            variant="inverse"
            size="md"
            shape="rounded"
            icon="none"
            action_type="url"
            target_url={item.href}
            className="mt-8"
          />
        ) : null}
        {hasButtons ? (
          <div className="mt-8">
            <SectionButtons
              buttons={item.buttons}
              inverted
              className="flex flex-wrap gap-2"
            />
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <SectionLightCard
      as="article"
      className="section-ui-card flex h-full flex-col rounded-[1.5rem] p-6 shadow-sm sm:p-7"
    >
      <span className="mb-3 inline-flex h-[22px]" aria-hidden />
      {item.title || preview ? (
        <h3
          className={`m-0 text-lg font-semibold tracking-tight ${DS_TEXT.heading}`}
        >
          {item.title ||
            (preview ? <CardPlaceholder>Plan name…</CardPlaceholder> : null)}
        </h3>
      ) : null}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
          {item.price ||
            (preview ? <CardPlaceholder>$—</CardPlaceholder> : "—")}
        </span>
        {item.period ? (
          <span className={`text-sm ${DS_TEXT.muted}`}>{item.period}</span>
        ) : null}
      </div>
      {!isRichTextEmpty(item.body) && features.length === 0 ? (
        <CmsRichText
          html={item.body}
          className={`mt-4 text-sm ${DS_TEXT.muted}`}
          empty={
            preview ? (
              <p className={`mt-4 mb-0 text-sm ${DS_TEXT.muted}`}>
                <CardPlaceholder>Features…</CardPlaceholder>
              </p>
            ) : null
          }
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
        <DsButton
          label={item.ctaLabel || "Get started"}
          variant="primary"
          size="md"
          shape="rounded"
          icon="none"
          action_type="url"
          target_url={item.href}
          className="mt-8"
        />
      ) : null}
      {hasButtons ? (
        <div className="mt-8">
          <SectionButtons buttons={item.buttons} className="flex flex-wrap gap-2" />
        </div>
      ) : null}
    </SectionLightCard>
  );
}

/**
 * Pure pricing tiers — 3-up with featured middle plan; no CMS chrome.
 */
export default function PricingTiersUi({
  title,
  subtitle,
  eyebrow,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  onDarkBand = false,
  preview = false,
  id,
  className = "",
}: PricingTiersUiProps) {

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
{items.length ? (
          <ul className="m-0 mx-auto grid max-w-5xl list-none gap-4 p-0 lg:grid-cols-3 lg:items-stretch lg:gap-5">
            {items.map((item, i) => (
              <li key={item.id ?? i} className="min-w-0">
                <PricingTierCard
                  item={item}
                  onDarkBand={onDarkBand}
                  preview={preview}
                />
              </li>
            ))}
          </ul>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
