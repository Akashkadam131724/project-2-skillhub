"use client";

import dynamic from "next/dynamic";
import { resolveSectionBehaviorKey } from "./section-items-config.js";
import { getManifestEntry } from "./section-manifest-resolve";

const lazyComponentCache = new Map();

/** Lazy public section component for a catalog key + optional render_key. */
export function resolveLazySectionComponent(sectionKey, renderKey) {
  const behavior = resolveSectionBehaviorKey(sectionKey, renderKey);
  const entry = getManifestEntry(sectionKey, renderKey);
  const loader = entry?.loadPublic;
  if (!loader) return null;

  if (!lazyComponentCache.has(behavior)) {
    lazyComponentCache.set(behavior, dynamic(loader, { loading: () => null }));
  }

  return lazyComponentCache.get(behavior);
}
