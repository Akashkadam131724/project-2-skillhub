import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import type { OverviewSectionProps } from "./types";

export function isOverviewPlacementShowable(
  props: OverviewSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  return shouldRenderPlacement(
    sectionProbeFromProps("overview", {
      section_title: props.section_title,
      sub_title: props.sub_title,
      data: props.data,
      section_img_url: props.section_img_url,
      buttons: props.buttons,
      button_title: props.button_title,
      target_url: props.target_url,
    }),
    false
  );
}
