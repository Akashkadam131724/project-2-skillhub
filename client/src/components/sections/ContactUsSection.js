"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { resolveItemsForSection, itemTitle } from "@/lib/item-types";
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

function iconKind(item) {
  const raw = String(item?.icon || item?.label || item?.title || "").toLowerCase();
  if (raw.includes("phone") || raw.includes("tel")) return "phone";
  if (raw.includes("loc") || raw.includes("address") || raw.includes("office")) {
    return "location";
  }
  return "email";
}

/**
 * Global Contact Us band — shared contact details across pages.
 * Uses section fields + items (title/subtitle/href for each channel).
 */
export default function ContactUsSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  buttons,
  button_title,
  target_url,
  section_key = "contact_us",
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const body = data?.body || "";
  const items = resolveItemsForSection(section_key, mappingItems);

  if (
    !cmsMode &&
    !section_title &&
    !sub_title &&
    isRichTextEmpty(body) &&
    !items.length
  ) {
    return null;
  }

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden border-t border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24 dark:border-slate-800 dark:bg-slate-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 42%), radial-gradient(circle at 88% 78%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 40%)",
        }}
      />

      <SectionWrapper>
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
          <div>
            <p className="m-0 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
              Contact
            </p>
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title || cmsMode ? (
                <h2 className="mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
                  {section_title || (cmsMode ? "Contact us" : null)}
                </h2>
              ) : null}
            </CmsEditable>

            <CmsEditable
              cmsMode={cmsMode}
              field="sub_title"
              label="Subtitle"
              onEditField={onEditField}
            >
              {sub_title || cmsMode ? (
                <p className="mt-4 mb-0 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                  {sub_title || (cmsMode ? "Supporting line…" : null)}
                </p>
              ) : null}
            </CmsEditable>

            {!isRichTextEmpty(body) || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="body"
                label="Body"
                onEditField={onEditField}
              >
                <CmsRichText
                  html={body}
                  className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  empty={
                    cmsMode ? (
                      <p className="m-0 text-slate-400 italic">Optional body…</p>
                    ) : null
                  }
                />
              </CmsEditable>
            ) : null}

            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              className="mt-8"
            />
          </div>

          <CmsEditable
            cmsMode={cmsMode}
            field="items"
            label="Contact channels"
            onEditField={onEditField}
          >
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-1">
              {items.length
                ? items.map((item, i) => {
                    const title = itemTitle(item) || item.title || "Channel";
                    const subtitle = item.subtitle || "";
                    const href = String(item.href || "").trim();
                    const Wrapper = href ? "a" : "div";
                    const linkProps = href
                      ? {
                          href,
                          className:
                            "group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 no-underline shadow-sm transition hover:border-brand/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-900",
                        }
                      : {
                          className:
                            "flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900",
                        };

                    return (
                      <li key={item._id || item.id || i}>
                        <Wrapper {...linkProps}>
                          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                            <ContactIcon kind={iconKind(item)} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-ink dark:text-white">
                              {title}
                            </span>
                            {subtitle ? (
                              <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-300">
                                {subtitle}
                              </span>
                            ) : null}
                            {!isRichTextEmpty(item.body) ? (
                              <CmsRichText
                                html={item.body}
                                className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                              />
                            ) : null}
                          </span>
                        </Wrapper>
                      </li>
                    );
                  })
                : cmsMode
                  ? [
                      <li
                        key="empty"
                        className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-400 italic dark:border-slate-600"
                      >
                        Add email, phone, and address items…
                      </li>,
                    ]
                  : null}
            </ul>
          </CmsEditable>
        </div>
      </SectionWrapper>
    </section>
  );
}
