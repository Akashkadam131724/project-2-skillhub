/**
 * Accordion category
 *
 * Layout per variant:
 *   <variant>/
 *     Ui.tsx | Static.tsx | PublicSection.tsx | Section.tsx
 *     lib/          — variant-only (cms-config, static-demo, extra types/map)
 *
 *   shared/lib/     — category-wide (FaqUiItem, resolveFaqUiItems, placement rules)
 *
 * CMS registry: client/src/lib/sections/configs/index.js
 *
 * New variant checklist:
 * 1. Copy faq/ → accordion/<variant>/
 * 2. Add lib/cms-config.js + register in lib/sections/configs
 * 3. Export from variant index + accordion/index.ts
 * 4. Wire Public in section-component-loaders.js
 * 5. Wire Cms in section-registry-sync.js
 */
export * from "./faq";
export * from "./faq-two-column";
export * from "./shared/lib";
export { default as FaqItemCard } from "./shared/FaqItemCard";
export type { FaqItemCardProps } from "./shared/FaqItemCard";
