import SectionButtons from "@/components/ui/SectionButtons";
import { mediaAlt } from "@/lib/utils/media-alt";
import StatementBandUi from "./StatementBandUi";
import {
  resolveHeroImageUrl,
  resolveHeroSectionButtons,
} from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { StatementBandSectionProps } from "./lib/types";

/** Public statement_band — maps placement props → {@link StatementBandUi}. */
export default function StatementBandPublicSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: StatementBandSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("statement_band", props, false)) {
    return null;
  }

  const list = resolveHeroSectionButtons(props);
  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const eyebrow = data?.eyebrow || data?.label || "";

  return (
    <StatementBandUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Statement background")}
      eyebrow={eyebrow || undefined}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={
        list.length ? (
          <SectionButtons
            buttons={list}
            onFormOpen={onFormOpen}
            inverted
            className="mt-10 flex flex-wrap items-center gap-3"
          />
        ) : null
      }
    />
  );
}
