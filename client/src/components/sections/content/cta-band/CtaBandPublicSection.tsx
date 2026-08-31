import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import CtaBandUi from "./CtaBandUi";
import { isCtaBandPlacementShowable } from "./lib/placement";
import type { CtaBandSectionProps } from "./lib/types";

export default function CtaBandPublicSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: CtaBandSectionProps) {
  if (
    !isCtaBandPlacementShowable(
      { section_title, sub_title, data, buttons, button_title, target_url },
      false
    )
  ) {
    return null;
  }

  return (
    <CtaBandUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        className: "mt-8 flex flex-wrap items-center justify-center gap-3",
      })}
    />
  );
}
