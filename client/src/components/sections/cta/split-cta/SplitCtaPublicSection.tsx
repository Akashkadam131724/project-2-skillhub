import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/api/cms-api";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import SplitCtaUi from "./SplitCtaUi";
import {
  normalizeSplitCtaImageSide,
  resolveSplitCtaBandStyle,
} from "./lib/band";
import { isSplitCtaPlacementShowable } from "./lib/placement";
import type { SplitCtaSectionProps } from "./lib/types";

export default function SplitCtaPublicSection({
  section_title,
  sub_title,
  section_img_url,
  section_bg_color,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: SplitCtaSectionProps) {
  if (
    !isSplitCtaPlacementShowable(
      {
        section_title,
        sub_title,
        section_img_url,
        data,
        buttons,
        button_title,
        target_url,
      },
      false
    )
  ) {
    return null;
  }

  const imageUrl = mediaUrl(section_img_url || data?.image_url);
  const bandStyle = resolveSplitCtaBandStyle(
    section_bg_color,
    data?.bg_color
  );
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <SplitCtaUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      imageUrl={imageUrl}
      imageSide={normalizeSplitCtaImageSide(data)}
      bandStyle={bandStyle}
      useThemeBand={!bandStyle}
      footer={
        list.length ? (
          <SectionButtons
            buttons={list}
            onFormOpen={onFormOpen}
            inverted
            className="flex flex-wrap items-center gap-3 [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2.5"
          />
        ) : null
      }
    />
  );
}
