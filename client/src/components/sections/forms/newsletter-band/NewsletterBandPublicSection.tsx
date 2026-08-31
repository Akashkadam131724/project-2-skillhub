import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
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
  id,
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

  return (
    <NewsletterBandUi
      id={id}
      eyebrow="Stay in the loop"
      title={section_title}
      subtitle={sub_title}
      placeholder={placeholder}
      readOnly
      formFooter={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        className: "flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap",
      })}
    />
  );
}
