"use client";

import HeroAsymmetricUi from "./HeroAsymmetricUi";
import { HERO_ASYMMETRIC_STATIC_DEMO } from "./lib/static-demo";

export default function HeroAsymmetricStatic() {
  const demo = HERO_ASYMMETRIC_STATIC_DEMO;
  return <HeroAsymmetricUi {...demo} />;
}
