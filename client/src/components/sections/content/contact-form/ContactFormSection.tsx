"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import ContactChannelCard from "../shared/ContactChannelCard";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import ContactFormUi from "./ContactFormUi";
import { resolveContactChannelUiItems } from "./lib/map";
import type { ContactFormSectionProps } from "./lib/types";

export default function ContactFormSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "contact_form",
  onEditField,
  id,
}: ContactFormSectionProps) {
  const body = data?.body || "";
  const successNote =
    data?.success_message ||
    "Thanks — your inquiry is in. A SkillHub specialist will follow up within one business day.";
  const items = resolveContactChannelUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <ContactFormUi
      id={id}
      preview
      successNote={successNote}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2
              className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl lg:text-[2.65rem]`}
            >
              {section_title}
            </h2>
          ) : (
            <h2
              className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl lg:text-[2.65rem]`}
            >
              Get in touch
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p
              className={`${DS_TEXT.muted} mt-4 mb-0 text-base leading-relaxed sm:text-lg`}
            >
              {sub_title}
            </p>
          ) : (
            <p
              className={`${DS_TEXT.muted} mt-4 mb-0 text-base leading-relaxed sm:text-lg`}
            >
              Supporting line…
            </p>
          )}
        </CmsEditable>
      }
      bodySlot={
        <CmsEditable
          cmsMode
          field="body"
          label="Body"
          onEditField={onEditField}
        >
          <CmsRichText
            html={body}
            className={`${DS_TEXT.muted} mt-4 text-sm leading-relaxed`}
            empty={
              <p className={`${DS_TEXT.placeholder} m-0 italic`}>
                Optional body…
              </p>
            }
          />
        </CmsEditable>
      }
      channelsSlot={
        <CmsEditable
          cmsMode
          field="items"
          label="Contact channels"
          onEditField={onEditField}
        >
          <ul className="mt-8 m-0 grid list-none gap-3 p-0">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <ContactChannelCard item={item} />
              </li>
            ))}
          </ul>
        </CmsEditable>
      }
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
          className="mt-4"
        />
      }
    />
  );
}
