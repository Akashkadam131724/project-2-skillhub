"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { DS_TYPE } from "@/lib/sections/section-design-system";
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
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        cmsMode,
      })}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        footerClassName: "mt-8",
        withItems: false,
      })}
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
              className={DS_TYPE.bodyBlock}
              empty={
                cmsMode ? (
                  <p className={DS_TYPE.placeholderSubtitle}>Optional body…</p>
                ) : null
              }
            />
          </CmsEditable>
        ) : undefined
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
                      className="section-theme-placeholder rounded-2xl border border-dashed border-[color:var(--band-border)] p-6 text-sm italic"
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
