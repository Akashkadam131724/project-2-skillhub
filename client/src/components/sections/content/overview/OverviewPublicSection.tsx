import SectionButtons from "@/components/ui/SectionButtons";
import SectionFrame from "@/components/sections/SectionFrame";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import OverviewUi from "./OverviewUi";
import { isOverviewPlacementShowable } from "./lib/placement";
import type { OverviewSectionProps } from "./lib/types";

export default function OverviewPublicSection({
  section_title,
  sub_title,
  data,
  section_img_url,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}: OverviewSectionProps) {
  if (
    !isOverviewPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        section_img_url,
        buttons,
        button_title,
        target_url,
      },
      false
    )
  ) {
    return null;
  }

  const imgUrl = mediaUrl(section_img_url);
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <SectionFrame eyebrow="Overview" {...frameProps}>
      <OverviewUi
        showImage={Boolean(imgUrl)}
        imageUrl={imgUrl}
        imageAlt={mediaAlt(section_title, "Overview")}
        title={section_title}
        subtitle={sub_title}
        body={data?.body}
        footer={
          list.length ? (
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              className="mt-2 flex flex-wrap items-center gap-3 sm:mt-3"
            />
          ) : null
        }
      />
    </SectionFrame>
  );
}
