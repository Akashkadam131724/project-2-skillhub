import { mediaUrl } from "@/lib/api/cms-api";
import { parseYoutubeVideoId } from "@/lib/utils/button-types";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import type { VideoBannerUiItem } from "./types";

type MappingItem = {
  href?: string;
  image_url?: string;
  title?: string;
  subtitle?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

function youtubeBannerSrc(videoUrl: string): string | undefined {
  const id = parseYoutubeVideoId(videoUrl);
  if (!id) return undefined;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function isVideoBannerItemShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  const videoSrc = youtubeBannerSrc(String(row.href || "").trim());
  const fallbackImageUrl = mediaUrl(row.image_url || "") || undefined;
  const title = String(row.title || "").trim();
  const subtitle = String(row.subtitle || "").trim();
  const buttons = Array.isArray(row.buttons) ? row.buttons : [];
  return Boolean(
    videoSrc || fallbackImageUrl || title || subtitle || buttons.length
  );
}

export function toVideoBannerUiItem(item: MappingItem): VideoBannerUiItem {
  const videoUrl = String(item.href || "").trim();
  return {
    title: String(item.title || ""),
    subtitle: String(item.subtitle || ""),
    videoSrc: youtubeBannerSrc(videoUrl),
    fallbackImageUrl: mediaUrl(item.image_url || "") || undefined,
    buttons: Array.isArray(item.buttons) ? item.buttons : [],
  };
}

export function resolveVideoBannerUiItem(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): VideoBannerUiItem | null {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const [first] = options.cmsMode
    ? resolved
    : resolved.filter(isVideoBannerItemShowable);
  return first ? toVideoBannerUiItem(first) : null;
}
