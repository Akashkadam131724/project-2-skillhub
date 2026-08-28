"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import ContactChannelCard from "../shared/ContactChannelCard";
import ContactUsUi from "./ContactUsUi";
import { resolveContactChannelUiItems } from "./lib/map";
import { isContactUsPlacementShowable } from "./lib/placement";
import type { ContactUsSectionProps } from "./lib/types";

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
  id,
}: ContactUsSectionProps) {
  const body = data?.body || "";
  const items = resolveContactChannelUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isContactUsPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      cmsMode
    )
  ) {
    return null;
  }

  return (
    <ContactUsUi
      id={id}
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title || cmsMode ? (
            <h2
              className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl`}
            >
              {section_title || (cmsMode ? "Contact us" : null)}
            </h2>
          ) : null}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title || cmsMode ? (
            <p
              className={`${DS_TEXT.muted} mt-4 mb-0 max-w-xl text-base leading-relaxed sm:text-lg`}
            >
              {sub_title || (cmsMode ? "Supporting line…" : null)}
            </p>
          ) : null}
        </CmsEditable>
      }
      bodySlot={
        !isRichTextEmpty(body) || cmsMode ? (
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
                  <p className={`${DS_TEXT.placeholder} m-0 italic`}>
                    Optional body…
                  </p>
                ) : null
              }
            />
          </CmsEditable>
        ) : undefined
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="mt-8"
        />
      }
      itemsSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="items"
          label="Contact channels"
          onEditField={onEditField}
        >
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-1">
            {items.length
              ? items.map((item) => (
                  <li key={item.id}>
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
      }
    />
  );
}
