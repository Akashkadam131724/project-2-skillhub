import SectionFrame from "@/components/sections/SectionFrame";
import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import NewsletterBandUi from "./NewsletterBandUi";
import { isNewsletterBandPlacementShowable } from "./lib/placement";
import type { NewsletterBandSectionProps } from "./lib/types";

export default function NewsletterBandPublicSection({
  section_title,
  sub_title,
  data = {},
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}: NewsletterBandSectionProps) {
  if (
    !isNewsletterBandPlacementShowable(
      {
        section_title,
        sub_title,
        buttons,
        button_title,
        target_url,
      },
      false
    )
  ) {
    return null;
  }

  const placeholder = data.email_placeholder || "Work email";
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="Stay in the loop"
      buttonsFooter={false}
      {...frameProps}
    >
      <NewsletterBandUi
        placeholder={placeholder}
        readOnly
        formFooter={
          list.length ? (
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap"
            />
          ) : null
        }
      />
    </SectionFrame>
  );
}
