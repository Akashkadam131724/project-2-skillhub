import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import TabsNestedUi from "./TabsNestedUi";
import { resolveTabUiItems } from "./lib/map";
import { isNestedTabsPlacementShowable } from "./lib/placement";
import type { TabsLayout, TabsSectionProps } from "./lib/types";

export default function NestedTabsPublicSection({
  layout,
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "feature_tabs",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TabsSectionProps & { layout: TabsLayout }) {
  if (
    !isNestedTabsPlacementShowable(
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

  const tabs = resolveTabUiItems(mappingItems);
  if (!tabs.length) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <TabsNestedUi
      layout={layout}
      id={id}
      eyebrow={(in_page_nav_title || "").trim() || undefined}
      title={section_title}
      subtitle={sub_title}
      tabs={tabs}
      onFormOpen={onFormOpen}
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
