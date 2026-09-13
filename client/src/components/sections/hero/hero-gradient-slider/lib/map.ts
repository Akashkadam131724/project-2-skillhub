import { mediaUrl } from "@/lib/api/cms-api";
import { groupItemsByTabs } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { HeroGradientSliderSlide, HeroGradientSliderStat } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  body?: string;
  image_url?: string;
  buttons?: unknown[];
  value?: string;
  label?: string;
  icon?: string;
  status?: boolean;
  children?: MappingItem[];
};

function mapStat(child: MappingItem, index: number): HeroGradientSliderStat | null {
  if (!child || child.status === false) return null;
  const value = String(child.value || "").trim();
  const label = String(child.label || child.title || "").trim();
  if (!value && !label) return null;

  const icon = String(child.icon || "").trim();
  return {
    id: String(child._id || child.id || `stat-${index}`),
    value,
    label,
    icon: icon || undefined,
  };
}

function slideHasContent(slide: HeroGradientSliderSlide) {
  return Boolean(
    slide.title.trim() ||
      !isRichTextEmpty(slide.body || "") ||
      slide.sideImageUrl ||
      (Array.isArray(slide.buttons) && slide.buttons.length) ||
      (slide.stats && slide.stats.length)
  );
}

function mapSlide(
  tab: MappingItem,
  index: number
): HeroGradientSliderSlide | null {
  if (!tab || tab.status === false) return null;

  const stats = (tab.children || [])
    .map((child, i) => mapStat(child, i))
    .filter((stat): stat is HeroGradientSliderStat => Boolean(stat));

  return {
    id: String(tab._id || tab.id || `slide-${index}`),
    title: String(tab.title || "").trim(),
    body: String(tab.body || ""),
    sideImageUrl: mediaUrl(tab.image_url || "") || undefined,
    buttons: Array.isArray(tab.buttons) ? tab.buttons : [],
    stats,
  };
}

export function resolveHeroGradientSliderSlides(
  items?: unknown[],
  { cmsMode = false } = {}
): HeroGradientSliderSlide[] {
  const slides = groupItemsByTabs(items)
    .map((tab, index) => mapSlide(tab as MappingItem, index))
    .filter((slide): slide is HeroGradientSliderSlide => Boolean(slide));

  if (cmsMode) return slides;
  return slides.filter(slideHasContent);
}
