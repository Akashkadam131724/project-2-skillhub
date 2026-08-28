import { mediaUrl } from "@/lib/api/cms-api";
import SplitNarrativeUi from "./SplitNarrativeUi";
import { resolveSplitNarrativeChapterUiItems } from "./lib/map";
import { isSplitNarrativePlacementShowable } from "./lib/placement";
import type { SplitNarrativeSectionProps } from "./lib/types";

export default function SplitNarrativePublicSection({
  section_title,
  sub_title,
  section_img_url,
  items: mappingItems,
  section_key = "split_narrative",
  id,
}: SplitNarrativeSectionProps) {
  if (!isSplitNarrativePlacementShowable({ items: mappingItems }, false)) {
    return null;
  }

  const items = resolveSplitNarrativeChapterUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <SplitNarrativeUi
      id={id}
      coverImageUrl={mediaUrl(section_img_url)}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
