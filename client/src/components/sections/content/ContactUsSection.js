"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import ContactChannelCard from "@/components/sections/content/ContactChannelCard";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { SectionBand, SectionBrandGlow } from "@/components/sections/design";
import { DS_TEXT } from "@/lib/section-design-system";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

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
    <SectionBand
      id="contact"
      className="section-band-divider-top"
      decor={<SectionBrandGlow />}
      wrapper
    >
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
          <div>
            <p className={DS_TEXT.eyebrow}>Contact</p>
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title || cmsMode ? (
                <h2 className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl`}>
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
                <p className={`${DS_TEXT.muted} mt-4 mb-0 max-w-xl text-base leading-relaxed sm:text-lg`}>
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
                  className={`${DS_TEXT.muted} mt-4 max-w-xl text-sm leading-relaxed`}
                  empty={
                    cmsMode ? (
                      <p className={`${DS_TEXT.placeholder} m-0 italic`}>Optional body…</p>
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
                ? items.map((item, i) => (
                    <li key={item._id || item.id || i}>
                      <ContactChannelCard item={item} />
                    </li>
                  ))
                : cmsMode
                  ? [
                      <li
                        key="empty"
                        className={`rounded-2xl border border-dashed border-[color:var(--band-border)] p-6 text-sm ${DS_TEXT.placeholder} italic`}
                      >
                        Add email, phone, and address items…
                      </li>,
                    ]
                  : null}
            </ul>
          </CmsEditable>
        </div>
    </SectionBand>
  );
}
