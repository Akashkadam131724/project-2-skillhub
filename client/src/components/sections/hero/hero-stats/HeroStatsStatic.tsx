// @ts-nocheck
"use client";

import HeroStatsUi from "./HeroStatsUi";
import { HERO_STATS_STATIC_DEMO } from "./lib/static-demo";

export default function HeroStatsStatic() {
  const demo = HERO_STATS_STATIC_DEMO;
  return <HeroStatsUi {...demo} />;
}
