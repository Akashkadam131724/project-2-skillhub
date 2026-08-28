// @ts-nocheck
"use client";

import HeroMediaUi from "./HeroMediaUi";
import type { HeroMediaSectionProps } from "./lib/types";

export default function HeroMediaPublicSection(props: HeroMediaSectionProps) {
  return <HeroMediaUi {...props} cmsMode={false} />;
}
