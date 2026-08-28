"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionLightCard from "@/components/sections/shared/design/SectionLightCard";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { itemTitle } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import ContactChannelIcon from "@/components/icons/ContactChannelIcon";

export function contactChannelIconKind(item) {
  const raw = String(item?.icon || item?.label || item?.title || "").toLowerCase();
  if (raw.includes("phone") || raw.includes("tel")) return "phone";
  if (raw.includes("loc") || raw.includes("address") || raw.includes("office")) {
    return "location";
  }
  return "email";
}

/**
 * Email / phone / location row — white card on dark bands, matches contact_us layout.
 */
export default function ContactChannelCard({ item, className = "" }) {
  const title = itemTitle(item) || item.title;
  const subtitle = item.subtitle || "";
  const href = String(item.href || "").trim();
  const Tag = href ? "a" : "div";

  return (
    <SectionLightCard
      as={Tag}
      {...(href ? { href } : {})}
      className={`section-light-card-shell--compact contact-channel-card flex gap-4 rounded-2xl p-4 shadow-none ${href ? "contact-channel-card--link no-underline transition hover:border-brand/40" : ""
        } ${className}`.trim()}
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
        <ContactChannelIcon kind={contactChannelIconKind(item)} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <span className="text-xs font-semibold tracking-wide text-brand uppercase">
            {title}
          </span>
        ) : null}
        {subtitle ? (
          <span className={`text-sm font-semibold leading-snug ${DS_TEXT.heading}`}>
            {subtitle}
          </span>
        ) : null}
        {!isRichTextEmpty(item.body) ? (
          <CmsRichText
            html={item.body}
            className={`${DS_TEXT.muted} text-xs leading-relaxed`}
          />
        ) : null}
      </span>
    </SectionLightCard>
  );
}
