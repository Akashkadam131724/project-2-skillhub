"use client";

import HeroClassicUi from "./HeroClassicUi";
import { HERO_CLASSIC_STATIC_DEMO } from "./lib/static-demo";

export default function HeroClassicStatic() {
  const demo = HERO_CLASSIC_STATIC_DEMO;
  return <HeroClassicUi {...demo} />;
}
