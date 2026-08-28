import { mediaUrl } from "@/lib/api/cms-api";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import type { HeroContentSectionProps, HeroData } from "./types";

export function resolveHeroImageUrl(
  section_img_url?: string,
  data?: HeroData
): string | undefined {
  return mediaUrl(section_img_url || data?.image_url) || undefined;
}

export function resolveHeroSectionButtons(
  props: Pick<
    HeroContentSectionProps,
    "buttons" | "button_title" | "target_url"
  >
) {
  return sortActiveButtons(
    Array.isArray(props.buttons) && props.buttons.length
      ? props.buttons
      : buttonsFromLegacy(props.button_title, props.target_url)
  );
}
