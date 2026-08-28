import SarderEcosystemUi from "./SarderEcosystemUi";
import { resolveSarderEcosystemGroups } from "./lib/map";
import {
  isSarderEcosystemPlacementShowable,
  resolveSarderEcosystemLogoSrc,
  resolveSarderEcosystemSubtitle,
  resolveSarderEcosystemTitle,
} from "./lib/placement";
import type { SarderEcosystemSectionProps } from "./lib/types";
import { mediaAlt } from "@/lib/utils/media-alt";

export default function SarderEcosystemPublicSection({
  section_title,
  sub_title,
  section_img_url,
  items: mappingItems,
  section_key = "sarder_ecosystem",
  id,
}: SarderEcosystemSectionProps) {
  const props = {
    section_key,
    section_title,
    sub_title,
    section_img_url,
    items: mappingItems,
  };

  if (!isSarderEcosystemPlacementShowable(props, false)) {
    return null;
  }

  const groups = resolveSarderEcosystemGroups(mappingItems, {
    fallbackStatic: true,
  });

  return (
    <SarderEcosystemUi
      id={id}
      title={resolveSarderEcosystemTitle(section_title)}
      subtitle={resolveSarderEcosystemSubtitle(sub_title)}
      logoSrc={resolveSarderEcosystemLogoSrc(section_img_url, {
        fallbackStatic: true,
      })}
      logoAlt={mediaAlt(section_title, "Sarder logo")}
      groups={groups}
    />
  );
}
