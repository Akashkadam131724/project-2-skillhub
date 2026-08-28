import PartnersMarqueeUi from "./PartnersMarqueeUi";
import { resolvePartnerLogoUiItems } from "./lib/map";
import { PARTNER_LOGOS } from "./lib/partner-logos";
import { isPartnersMarqueePlacementShowable } from "./lib/placement";
import type { PartnersMarqueeSectionProps } from "./lib/types";

/** Public partners marquee — CMS logos or {@link PARTNER_LOGOS} fallback. */
export default function PartnersMarqueePublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "partners_marquee",
  id,
}: PartnersMarqueeSectionProps) {
  if (
    !isPartnersMarqueePlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
      },
      false
    )
  ) {
    return null;
  }

  const fromCms = resolvePartnerLogoUiItems(section_key, mappingItems);
  const items = fromCms.length
    ? fromCms
    : PARTNER_LOGOS.map((logo, i) => ({
        id: `fallback-${i}`,
        name: logo.name,
        imageUrl: logo.image_url,
      }));

  if (!items.length) return null;

  return (
    <PartnersMarqueeUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
