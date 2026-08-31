import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
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

  return (
    <VideoBannerUi
      id={id}
      item={item}
      footer={publicSectionButtonsFooter({
        buttons: item.buttons,
        onFormOpen,
        inverted: true,
        className: "",
        buttonsClassName:
          "flex shrink-0 flex-wrap items-center justify-start gap-3 sm:mt-0 sm:justify-end",
      })}
    />
  );
}
