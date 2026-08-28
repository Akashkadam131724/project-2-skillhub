import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <TabsNestedUi
      layout={layout}
      id={id}
      eyebrow={(in_page_nav_title || "").trim() || undefined}
      title={section_title}
      subtitle={sub_title}
      tabs={tabs}
      onFormOpen={onFormOpen}
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
