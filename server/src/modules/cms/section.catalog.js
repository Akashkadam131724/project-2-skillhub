/**
 * Canonical section category + tags for the CMS catalog.
 * Used when seeding / backfilling Section documents.
 * Keys must match registered React section components.
 */

export const SECTION_CATEGORIES = [
  { key: "hero", name: "Hero" },
  { key: "content", name: "Content" },
  { key: "features", name: "Features & cards" },
  { key: "tabs", name: "Tabs" },
  { key: "accordion", name: "Accordion" },
  { key: "catalog", name: "Catalog & learning" },
  { key: "social_proof", name: "Social proof" },
  { key: "data", name: "Data & stats" },
  { key: "navigation", name: "Navigation" },
];

export const SECTION_CATEGORY_KEYS = SECTION_CATEGORIES.map((c) => c.key);

/** key → { category, tags } */
export const SECTION_CATALOG_META = {
  overview: { category: "content", tags: ["text", "image"] },
  text_media: { category: "content", tags: ["text", "image"] },
  key_benefits: { category: "features", tags: ["cards", "benefits"] },
  team: { category: "features", tags: ["cards", "people"] },
  editorial_banner: { category: "hero", tags: ["hero", "full-bleed"] },
  feature_spotlight: { category: "features", tags: ["cards", "spotlight"] },
  process_steps: { category: "features", tags: ["steps", "process"] },
  cta_band: { category: "content", tags: ["cta", "band"] },
  contact_us: { category: "content", tags: ["contact", "global"] },
  contact_form: { category: "content", tags: ["contact", "form", "enterprise"] },
  statement_band: { category: "hero", tags: ["hero", "typography"] },
  bento_grid: { category: "features", tags: ["bento", "mosaic"] },
  horizon_gallery: { category: "content", tags: ["gallery", "slider"] },
  split_narrative: { category: "content", tags: ["story", "sticky"] },
  pillar_destinations: { category: "features", tags: ["pillars", "links"] },
  orbit_hero: { category: "hero", tags: ["hero", "product-frame"] },
  card_stack: { category: "features", tags: ["stack", "scroll"] },
  feature_tabs: { category: "tabs", tags: ["tabs", "vertical", "preview"] },
  tabs_vertical: { category: "tabs", tags: ["tabs", "vertical"] },
  tabs_horizontal: { category: "tabs", tags: ["tabs", "horizontal", "pills"] },
  tabs_underline: { category: "tabs", tags: ["tabs", "underline", "editorial"] },
  tabs_success_stories: {
    category: "tabs",
    tags: ["tabs", "horizontal", "icons", "case-study"],
  },
  pricing_tiers: { category: "content", tags: ["pricing", "plans"] },
  masonry_quotes: {
    category: "social_proof",
    tags: ["testimonials", "masonry"],
  },
  metric_rail: { category: "data", tags: ["metrics", "proof"] },
  site_builder_hero: { category: "hero", tags: ["builder", "hero"] },
  template_gallery: { category: "content", tags: ["templates", "gallery"] },
  builder_feature_cards: {
    category: "features",
    tags: ["features", "cards"],
  },
  domain_search_band: { category: "content", tags: ["domain", "search"] },
  website_build_steps: { category: "content", tags: ["steps", "guide"] },
  video_banner: { category: "hero", tags: ["video", "full-bleed"] },
  cast_profiles: { category: "features", tags: ["cast", "profiles", "people"] },
  why_choose: { category: "features", tags: ["cards", "cta"] },
  stats: { category: "data", tags: ["metrics", "strip"] },
  related_courses: { category: "catalog", tags: ["courses", "cards"] },
  curriculum: { category: "catalog", tags: ["learning", "list"] },
  partners: { category: "social_proof", tags: ["logos", "partners"] },
  partners_marquee: { category: "social_proof", tags: ["logos", "marquee"] },
  training_options: { category: "features", tags: ["cards", "options"] },
  awards: { category: "social_proof", tags: ["awards", "cards"] },
  in_page_nav: { category: "navigation", tags: ["sticky", "links"] },
  testimonials: { category: "social_proof", tags: ["quotes", "reviews"] },
  customer_testimonials: {
    category: "social_proof",
    tags: ["carousel", "reviews", "global"],
  },
  page_testimonials: {
    category: "social_proof",
    tags: ["carousel", "reviews", "page"],
    render_key: "customer_testimonials",
  },
  faq: { category: "accordion", tags: ["accordion", "questions"] },
  resources: { category: "catalog", tags: ["resources", "cards"] },
  products: { category: "catalog", tags: ["products", "grid"] },
  catalog: { category: "catalog", tags: ["courses", "filters"] },
  entity_directory: { category: "catalog", tags: ["directory", "filters"] },
  latest_blogs: {
    category: "content",
    tags: ["blogs", "articles", "latest"],
  },
  blog_directory: {
    category: "catalog",
    tags: ["blogs", "directory", "search"],
  },
  hero_classic: { category: "hero", tags: ["hero", "cta"] },
  hero_split: { category: "hero", tags: ["hero", "split"] },
  hero_centered: { category: "hero", tags: ["hero", "centered"] },
  hero_minimal: { category: "hero", tags: ["hero", "minimal"] },
  hero_media: { category: "hero", tags: ["hero", "slider"] },
  hero_stats: { category: "hero", tags: ["hero", "metrics"] },
  hero_asymmetric: { category: "hero", tags: ["hero", "asymmetric"] },
  hero_dual_cta: { category: "hero", tags: ["hero", "cta"] },
};

export function normalizeSectionTag(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function normalizeSectionTags(tags) {
  if (!Array.isArray(tags)) return [];
  const out = [];
  const seen = new Set();
  for (const raw of tags) {
    const tag = normalizeSectionTag(raw);
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out.slice(0, 12);
}

export function getSectionCatalogMeta(key) {
  const normalized = String(key || "").toLowerCase();
  return SECTION_CATALOG_META[normalized] || null;
}
