"use client";

import HeroSplitUi from "./HeroSplitUi";
import { HERO_SPLIT_STATIC_DEMO } from "./lib/static-demo";

export default function HeroSplitStatic() {
  const demo = HERO_SPLIT_STATIC_DEMO;
  return <HeroSplitUi {...demo} />;
}
