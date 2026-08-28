import ContactFormUi from "./ContactFormUi";
import { resolveContactChannelUiItems } from "./lib/map";
import { isContactFormPlacementShowable } from "./lib/placement";
import type { ContactFormSectionProps } from "./lib/types";

export default function ContactFormPublicSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "contact_form",
  id,
}: ContactFormSectionProps) {
  if (
    !isContactFormPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        data,
        items: mappingItems,
      },
      false
    )
  ) {
    return null;
  }

  const channels = resolveContactChannelUiItems(section_key, mappingItems);
  const body = data?.body || "";
  const successNote =
    data?.success_message ||
    "Thanks — your inquiry is in. A SkillHub specialist will follow up within one business day.";

  return (
    <ContactFormUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={body}
      successNote={successNote}
      channels={channels}
    />
  );
}
