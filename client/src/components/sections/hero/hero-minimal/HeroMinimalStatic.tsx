// @ts-nocheck
"use client";

import HeroMinimalUi from "./HeroMinimalUi";
import { HERO_MINIMAL_STATIC_DEMO } from "./lib/static-demo";

export default function HeroMinimalStatic() {
  const demo = HERO_MINIMAL_STATIC_DEMO;
  return <HeroMinimalUi {...demo} />;
}
