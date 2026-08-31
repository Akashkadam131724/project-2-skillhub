import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import TrainingOptionsUi from "./TrainingOptionsUi";
import { resolveTrainingOptionUiItems } from "./lib/map";
import { isTrainingOptionsPlacementShowable } from "./lib/placement";
import type { TrainingOptionsSectionProps } from "./lib/types";

/**
 * Public training options — maps placement props → {@link TrainingOptionsUi}.
 */
export default function TrainingOptionsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "training_options",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TrainingOptionsSectionProps) {
  if (
    !isTrainingOptionsPlacementShowable(
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

  const items = resolveTrainingOptionUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <TrainingOptionsUi
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
