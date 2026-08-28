import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import ContactUsUi from "./ContactUsUi";
import { resolveContactChannelUiItems } from "./lib/map";
import { isContactUsPlacementShowable } from "./lib/placement";
import type { ContactUsSectionProps } from "./lib/types";

export default function ContactUsPublicSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "contact_us",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: ContactUsSectionProps) {
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
      false
    )
  ) {
    return null;
  }

  const items = resolveContactChannelUiItems(section_key, mappingItems);
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <ContactUsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      items={items}
      footer={
        list.length ? (
          <SectionButtons
            buttons={list}
            onFormOpen={onFormOpen}
            className="mt-8 flex flex-wrap items-center gap-3"
          />
        ) : null
      }
    />
  );
}
