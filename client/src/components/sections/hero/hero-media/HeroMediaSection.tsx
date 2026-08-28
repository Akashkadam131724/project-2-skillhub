// @ts-nocheck
"use client";

import HeroMediaUi from "./HeroMediaUi";
import type { HeroMediaSectionProps } from "./lib/types";

/** CMS-only hero_media adapter → {@link HeroMediaUi}. */
export default function HeroMediaSection(props: HeroMediaSectionProps) {
  return <HeroMediaUi {...props} cmsMode />;
}
