import SectionButtons from "@/components/ui/SectionButtons";
import LearningPathUi from "./LearningPathUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <LearningPathUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
