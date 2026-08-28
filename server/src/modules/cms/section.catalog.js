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
  { key: "overlays", name: "Overlays & modals" },
  { key: "forms", name: "Forms & capture" },
  { key: "comparison", name: "Compare & choose" },
  { key: "media", name: "Media & galleries" },
  { key: "timeline", name: "Timeline & journey" },
  { key: "pricing", name: "Pricing & packages" },
  { key: "trust", name: "Trust & compliance" },
  { key: "cta", name: "Calls to action" },
  { key: "learning", name: "Learning experience" },
];

export const SECTION_CATEGORY_KEYS = SECTION_CATEGORIES.map((c) => c.key);

/** key → { category, tags } */
export const SECTION_CATALOG_META = {
  overview: { category: "content" },
  text_media: { category: "content" },
  key_benefits: { category: "features" },
  team: { category: "features" },
  editorial_banner: { category: "hero" },
  feature_spotlight: { category: "features" },
  process_steps: { category: "features" },
  cta_band: { category: "cta" },
  split_cta: { category: "cta" },
  contact_us: { category: "content" },
  contact_form: { category: "forms" },
  newsletter_band: { category: "forms" },
  form_split: { category: "forms" },
  statement_band: { category: "hero" },
  bento_grid: { category: "features" },
  horizon_gallery: { category: "content" },
  split_narrative: { category: "content" },
  pillar_destinations: { category: "features" },
  orbit_hero: { category: "hero" },
  card_stack: { category: "features" },
  feature_tabs: { category: "tabs" },
  tabs_vertical: { category: "tabs" },
  tabs_horizontal: { category: "tabs" },
  tabs_underline: { category: "tabs" },
  tabs_success_stories: {
    category: "tabs",
  },
  pricing_tiers: { category: "pricing" },
  promo_modal: { category: "overlays" },
  comparison_table: { category: "comparison" },
  media_mosaic: { category: "media" },
  timeline_vertical: { category: "timeline" },
  trust_badges: { category: "trust" },
  learning_path: { category: "learning" },
  faq_two_column: { category: "accordion" },
  masonry_quotes: {
    category: "social_proof",
  },
  metric_rail: { category: "data" },
  site_builder_hero: { category: "hero" },
  template_gallery: { category: "content" },
  builder_feature_cards: {
    category: "features",
  },
  domain_search_band: { category: "content" },
  website_build_steps: { category: "content" },
  video_banner: { category: "hero" },
  cast_profiles: { category: "features" },
  why_choose: { category: "features" },
  stats: { category: "data" },
  related_courses: { category: "catalog" },
  curriculum: { category: "catalog" },
  partners: { category: "social_proof" },
  partners_marquee: { category: "social_proof" },
  training_options: { category: "features" },
  awards: { category: "social_proof" },
  in_page_nav: { category: "navigation" },
  testimonials: { category: "social_proof" },
  customer_testimonials: {
    category: "social_proof",
  },
  page_testimonials: {
    category: "social_proof",
    render_key: "customer_testimonials",
  },
  faq: { category: "accordion" },
  resources: { category: "catalog" },
  products: { category: "catalog" },
  catalog: { category: "catalog" },
  entity_directory: { category: "catalog" },
  latest_blogs: {
    category: "content",
  },
  blog_directory: {
    category: "catalog",
  },
  hero_classic: { category: "hero" },
  hero_split: { category: "hero" },
  hero_centered: { category: "hero" },
  hero_minimal: { category: "hero" },
  hero_media: { category: "hero" },
  hero_stats: { category: "hero" },
  hero_asymmetric: { category: "hero" },
  hero_dual_cta: { category: "hero" },
  hero_gradient_slider: { category: "hero" },
};

/** Reserved for optional seed hints — bands inherit site `surface_mode` by default. */
export const SECTION_DEFAULT_THEME = {};

export function getSectionDefaultTheme(key) {
  const normalized = String(key || "").toLowerCase();
  return SECTION_DEFAULT_THEME[normalized] || "";
}

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
