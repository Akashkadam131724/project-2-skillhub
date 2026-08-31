"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { DS_TYPE } from "@/lib/sections/section-design-system";
import ContactChannelCard from "../shared/ContactChannelCard";
import ContactFormUi from "./ContactFormUi";
import { resolveContactChannelUiItems } from "./lib/map";
import { isContactFormPlacementShowable } from "./lib/placement";
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

  if (
    !isContactFormPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        items: mappingItems,
        section_key,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <ContactFormUi
      id={id}
      preview
      successNote={successNote}
      {...cmsSectionHeaderSlots({
        section_title: section_title || "Get in touch",
        sub_title: sub_title || "Supporting line…",
        onEditField,
        cmsMode: true,
      })}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
      })}
      bodySlot={
        <CmsEditable
          cmsMode
          field="body"
          label="Body"
          onEditField={onEditField}
        >
          <CmsRichText
            html={body}
            className={DS_TYPE.bodyBlock}
            empty={
              <p className={DS_TYPE.placeholderSubtitle}>Optional body…</p>
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
          <ul className="m-0 grid list-none gap-3 p-0">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <ContactChannelCard item={item} />
              </li>
            ))}
          </ul>
        </CmsEditable>
      }
    />
  );
}
