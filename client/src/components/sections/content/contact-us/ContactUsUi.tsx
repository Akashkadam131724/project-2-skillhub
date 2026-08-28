import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { SectionBand, SectionBrandGlow } from "@/components/sections/shared/design";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import ContactChannelCard from "../shared/ContactChannelCard";
import type { ContactUsUiProps } from "./lib/types";

export default function ContactUsUi({
  id,
  title,
  subtitle,
  body = "",
  items = [],
  titleSlot,
  subtitleSlot,
  bodySlot,
  itemsSlot,
  footer = null,
}: ContactUsUiProps) {
  return (
    <SectionBand
      id={id || "contact"}
      className="section-band-divider-top"
      decor={<SectionBrandGlow />}
      wrapper
    >
      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
        <div>
          <p className={DS_TEXT.eyebrow}>Contact</p>
          {titleSlot ??
            (title ? (
              <h2
                className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl`}
              >
                {title}
              </h2>
            ) : null)}

          {subtitleSlot ??
            (subtitle ? (
              <p
                className={`${DS_TEXT.muted} mt-4 mb-0 max-w-xl text-base leading-relaxed sm:text-lg`}
              >
                {subtitle}
              </p>
            ) : null)}

          {bodySlot ??
            (!isRichTextEmpty(body) ? (
              <CmsRichText
                html={body}
                className={`${DS_TEXT.muted} mt-4 max-w-xl text-sm leading-relaxed`}
              />
            ) : null)}

          {footer}
        </div>

        {itemsSlot ?? (
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-1">
            {items.map((item) => (
              <li key={item.id}>
                <ContactChannelCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionBand>
  );
}
