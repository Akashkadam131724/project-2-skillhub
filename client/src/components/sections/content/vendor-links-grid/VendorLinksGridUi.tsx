import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { SectionBand } from "@/components/sections/shared/design";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import VendorLinksGridBandDecor from "./VendorLinksGridBandDecor";
import VendorLinksGridLinkCard from "./VendorLinksGridLinkCard";
import type { VendorLinksGridUiProps } from "./lib/types";

const titleClassName =
  "m-0 mb-4 text-left font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight sm:mb-6 sm:text-4xl";

export default function VendorLinksGridUi({
  id,
  title,
  body,
  links,
  titleSlot,
  bodySlot,
  linksSlot,
  footer = null,
  onDarkBand = true,
  className = "",
}: VendorLinksGridUiProps) {
  const sorted = [...links].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  const showTitle = titleSlot != null || Boolean(title);
  const showBody =
    bodySlot != null || (body && !isRichTextEmpty(body)) || Boolean(body);
  const showLinks = linksSlot != null || sorted.length > 0;

  if (!showTitle && !showBody && !showLinks && !footer) return null;

  const headingClass = `${titleClassName} ${DS_TEXT.heading}`;
  const bodyClass = `mb-4 text-base leading-relaxed ${DS_TEXT.muted}`;

  return (
    <SectionBand
      id={id}
      decor={<VendorLinksGridBandDecor darkBand={onDarkBand} />}
      wrapper
      className={className}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="animate-in fade-in slide-in-from-left-4 space-y-3 duration-700 lg:w-2/5">
          {titleSlot ??
            (showTitle ? (
              <h2 className={headingClass}>{title}</h2>
            ) : null)}

          {bodySlot ??
            (body && !isRichTextEmpty(body) ? (
              <CmsRichText html={body} className={bodyClass} />
            ) : body ? (
              <p className={`m-0 ${bodyClass}`}>{body}</p>
            ) : null)}

          {footer ? <div className="pt-2">{footer}</div> : null}
        </div>

        {showLinks ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700 lg:w-3/5 [animation-delay:150ms]">
            {linksSlot ?? (
              <div className="grid grid-cols-1 divide-y overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm sm:grid-cols-2 sm:divide-x sm:divide-y dark:border-slate-700/80">
                {sorted.map((link, index) => (
                  <VendorLinksGridLinkCard
                    key={String(link.id)}
                    link={link}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </SectionBand>
  );
}
