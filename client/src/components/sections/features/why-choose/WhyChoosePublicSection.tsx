import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import WhyChooseUi from "./WhyChooseUi";
import { resolveWhyChooseUiItems } from "./lib/map";
import { isWhyChoosePlacementShowable } from "./lib/placement";
import type { WhyChooseSectionProps } from "./lib/types";

/**
 * Public why choose — maps placement props → {@link WhyChooseUi}.
 */
export default function WhyChoosePublicSection({
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "why_choose",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: WhyChooseSectionProps) {
  if (
    !isWhyChoosePlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        in_page_nav_title,
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

  const items = resolveWhyChooseUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <WhyChooseUi
      id={id}
      eyebrow={(in_page_nav_title || "").trim() || undefined}
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
        className: "mt-8 sm:mt-10",
      })}
    />
  );
}
