import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import CurriculumUi from "./CurriculumUi";
import { resolveCurriculumUiItems } from "./lib/map";
import { isCurriculumPlacementShowable } from "./lib/placement";
import type { CurriculumSectionProps } from "./lib/types";

export default function CurriculumPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "curriculum",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: CurriculumSectionProps) {
  if (
    !isCurriculumPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
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

  const items = resolveCurriculumUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <CurriculumUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}
    />
  );
}
