"use client";

import HeroDualCtaUi from "./HeroDualCtaUi";
import { HERO_DUAL_CTA_STATIC_DEMO } from "./lib/static-demo";

export default function HeroDualCtaStatic() {
  const demo = HERO_DUAL_CTA_STATIC_DEMO;
  return <HeroDualCtaUi {...demo} />;
}
