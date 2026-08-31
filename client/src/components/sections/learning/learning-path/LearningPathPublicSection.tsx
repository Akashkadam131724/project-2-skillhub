import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import LearningPathUi from "./LearningPathUi";
import { resolveLearningPathStepUiItems } from "./lib/map";
import { isLearningPathPlacementShowable } from "./lib/placement";
import type { LearningPathSectionProps } from "./lib/types";

/** Public learning path — maps placement props → {@link LearningPathUi}. */
export default function LearningPathPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "learning_path",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: LearningPathSectionProps) {
  if (
    !isLearningPathPlacementShowable(
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

  const items = resolveLearningPathStepUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <LearningPathUi
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
