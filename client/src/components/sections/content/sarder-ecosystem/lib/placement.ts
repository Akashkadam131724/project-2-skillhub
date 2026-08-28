import {
  SARDER_ECOSYSTEM_STATIC_LOGO,
  SARDER_ECOSYSTEM_STATIC_SUBTITLE,
  SARDER_ECOSYSTEM_STATIC_TITLE,
} from "./static-demo";
import { resolveSarderEcosystemGroups, resolveSarderEcosystemLogo } from "./map";
import type { SarderEcosystemSectionProps } from "./types";

export function isSarderEcosystemPlacementShowable(
  props: SarderEcosystemSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;

  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  if (resolveSarderEcosystemLogo(props.section_img_url, { fallbackStatic: false })) {
    return true;
  }

  return (
    resolveSarderEcosystemGroups(props.items, { fallbackStatic: true }).length > 0
  );
}

export function resolveSarderEcosystemTitle(sectionTitle?: string, cmsMode = false) {
  const title = String(sectionTitle || "").trim();
  if (title) return title;
  if (cmsMode) return SARDER_ECOSYSTEM_STATIC_TITLE;
  return SARDER_ECOSYSTEM_STATIC_TITLE;
}

export function resolveSarderEcosystemSubtitle(subTitle?: string, cmsMode = false) {
  const subtitle = String(subTitle || "").trim();
  if (subtitle) return subtitle;
  if (cmsMode) return SARDER_ECOSYSTEM_STATIC_SUBTITLE;
  return SARDER_ECOSYSTEM_STATIC_SUBTITLE;
}

export function resolveSarderEcosystemLogoSrc(
  sectionImgUrl?: string | null,
  { cmsMode = false, fallbackStatic = false } = {}
) {
  const url = resolveSarderEcosystemLogo(sectionImgUrl, { fallbackStatic });
  if (url) return url;
  if (cmsMode || fallbackStatic) return SARDER_ECOSYSTEM_STATIC_LOGO;
  return "";
}
