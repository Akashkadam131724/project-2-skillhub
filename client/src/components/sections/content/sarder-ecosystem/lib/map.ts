import { groupItemsByTabs } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import { SARDER_ECOSYSTEM_STATIC_GROUPS, SARDER_ECOSYSTEM_STATIC_LOGO } from "./static-demo";
import type { SarderEcosystemGroup, SarderEcosystemLogoItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  image_url?: string;
  href?: string;
  status?: boolean;
  children?: MappingItem[];
};

function mapLogoItem(child: MappingItem, index: number): SarderEcosystemLogoItem | null {
  if (!child || child.status === false) return null;
  const label = String(child.title || "").trim();
  const logo = mediaUrl(child.image_url || "");
  if (!label || !logo) return null;

  const href = String(child.href || "").trim();
  const alt = String(child.subtitle || label).trim();

  return {
    id: String(child._id || child.id || `logo-${index}`),
    logo,
    alt,
    label,
    href: href || undefined,
    disabled: !href,
  };
}

function mapGroup(tab: MappingItem, index: number): SarderEcosystemGroup | null {
  if (!tab || tab.status === false) return null;
  const title = String(tab.title || "").trim();
  if (!title) return null;

  const items = (tab.children || [])
    .map((child, i) => mapLogoItem(child, i))
    .filter((item): item is SarderEcosystemLogoItem => Boolean(item));

  return {
    id: String(tab._id || tab.id || `group-${index}`),
    title,
    items,
  };
}

export function resolveSarderEcosystemGroups(
  items?: unknown[],
  { fallbackStatic = false, cmsMode = false } = {}
): SarderEcosystemGroup[] {
  const groups = groupItemsByTabs(items)
    .map((tab, index) => mapGroup(tab as MappingItem, index))
    .filter((group): group is SarderEcosystemGroup => Boolean(group));

  if (groups.length) return groups;
  if (fallbackStatic && !cmsMode) return SARDER_ECOSYSTEM_STATIC_GROUPS;
  return [];
}

export function resolveSarderEcosystemLogo(
  sectionImgUrl?: string | null,
  { fallbackStatic = false } = {}
) {
  const url = mediaUrl(sectionImgUrl || "");
  if (url) return url;
  if (fallbackStatic) return SARDER_ECOSYSTEM_STATIC_LOGO;
  return "";
}
