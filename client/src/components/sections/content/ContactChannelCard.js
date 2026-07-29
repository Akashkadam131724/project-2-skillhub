"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import SectionLightCard from "@/components/sections/design/SectionLightCard";
import { DS_TEXT } from "@/lib/section-design-system";
import { itemTitle } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

function ContactIcon({ kind }) {
  const props = {
    className: "size-5 shrink-0 text-brand",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    "aria-hidden": true,
  };

  if (kind === "phone") {
    return (
      <svg {...props}>
        <path
          d="M6.5 4.5h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.7 2 2 0 0 1 6.5 4.5Z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "location") {
    return (
      <svg {...props}>
        <path
          d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.25" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinejoin="round" />
    </svg>
  );
}

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
        <ContactIcon kind={contactChannelIconKind(item)} />
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
