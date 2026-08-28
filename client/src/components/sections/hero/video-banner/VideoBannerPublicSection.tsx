import SectionButtons from "@/components/ui/SectionButtons";
import { sortActiveButtons } from "@/lib/utils/button-types";
import VideoBannerUi from "./VideoBannerUi";
import { resolveVideoBannerUiItem } from "./lib/map";
import { isVideoBannerPlacementShowable } from "./lib/placement";
import type { VideoBannerSectionProps } from "./lib/types";

/** Public video_banner — maps placement props → {@link VideoBannerUi}. */
export default function VideoBannerPublicSection({
  items: mappingItems,
  section_key = "video_banner",
  onFormOpen,
  id,
}: VideoBannerSectionProps) {
  if (
    !isVideoBannerPlacementShowable(
      { section_key, items: mappingItems },
      false
    )
  ) {
    return null;
  }

  const item = resolveVideoBannerUiItem(section_key, mappingItems);
  if (!item) return null;

  const buttons = sortActiveButtons(item.buttons || []);

  return (
    <VideoBannerUi
      id={id}
      item={item}
      footer={
        buttons.length ? (
          <SectionButtons
            buttons={buttons}
            onFormOpen={onFormOpen}
            inverted
            className="flex shrink-0 flex-wrap items-center justify-start gap-3 sm:mt-0 sm:justify-end"
          />
        ) : null
      }
    />
  );
}
