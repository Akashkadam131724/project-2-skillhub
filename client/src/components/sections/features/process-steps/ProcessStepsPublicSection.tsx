import SectionButtons from "@/components/ui/SectionButtons";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import ProcessStepsUi from "./ProcessStepsUi";
import { resolveProcessStepUiItems } from "./lib/map";
import { isProcessStepsPlacementShowable } from "./lib/placement";
import type { ProcessStepsSectionProps } from "./lib/types";

/**
 * Public process steps — maps placement props → {@link ProcessStepsUi}.
 */
export default function ProcessStepsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "process_steps",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: ProcessStepsSectionProps) {
  if (
    !isProcessStepsPlacementShowable(
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

  const items = resolveProcessStepUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <ProcessStepsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      onDarkBand={onDarkBand}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              inverted={onDarkBand}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
