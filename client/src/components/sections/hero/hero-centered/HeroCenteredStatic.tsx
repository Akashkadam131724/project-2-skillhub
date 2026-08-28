// @ts-nocheck
"use client";

import HeroCenteredUi from "./HeroCenteredUi";
import { HERO_CENTERED_STATIC_DEMO } from "./lib/static-demo";

export default function HeroCenteredStatic() {
  const demo = HERO_CENTERED_STATIC_DEMO;
  return <HeroCenteredUi {...demo} />;
}
