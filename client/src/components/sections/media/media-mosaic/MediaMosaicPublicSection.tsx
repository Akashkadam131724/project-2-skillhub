import SectionButtons from "@/components/ui/SectionButtons";
import MediaMosaicUi from "./MediaMosaicUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { resolveMediaMosaicTileUiItems } from "./lib/map";
import { isMediaMosaicPlacementShowable } from "./lib/placement";
import type { MediaMosaicSectionProps } from "./lib/types";

/** Public media mosaic — maps placement props → {@link MediaMosaicUi}. */
export default function MediaMosaicPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "media_mosaic",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MediaMosaicSectionProps) {
  if (
    !isMediaMosaicPlacementShowable(
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

  const items = resolveMediaMosaicTileUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <MediaMosaicUi
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
