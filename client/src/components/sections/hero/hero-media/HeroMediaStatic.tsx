"use client";

import HeroMediaUi from "./HeroMediaUi";
import { HERO_MEDIA_STATIC_DEMO } from "./lib/static-demo";

export default function HeroMediaStatic() {
  const demo = HERO_MEDIA_STATIC_DEMO;
  return <HeroMediaUi {...demo} />;
}
