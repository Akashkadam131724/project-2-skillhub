import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
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

  return (
    <ProcessStepsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      onDarkBand={onDarkBand}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        inverted: onDarkBand,
      })}
    />
  );
}
