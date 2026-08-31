import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
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
  id,
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

  return (
    <OverviewUi
      id={id}
      showImage={Boolean(imgUrl)}
      imageUrl={imgUrl}
      imageAlt={mediaAlt(section_title, "Overview")}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        className: "mt-2 flex flex-wrap items-center gap-3 sm:mt-3",
      })}
    />
  );
}
