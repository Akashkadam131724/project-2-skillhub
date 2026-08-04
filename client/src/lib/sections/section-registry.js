import {
  SECTION_ITEMS_CONFIG,
  sectionUsesItems,
  getSectionItemsConfig,
  sectionRequiresItems,
  resolveSectionBehaviorKey,
} from "./section-items-config.js";

/**
 * Registry surface hint (documentation + isKnownSectionKey).
 * Runtime band behavior lives in `section-theme.js`:
 *   SECTION_OWN_BAND_KEYS — paints its own full-bleed band
 *   SECTION_THEME_BAND_SKIP_KEYS — CTA / nav / modal (no SectionSurface band)
 *   SECTION_FIXED_BAND_THEME_KEYS — fixed light/dark palette (hide theme in CMS)
 *   placementAdvancesAlternationIndex() — white/grey counter
 *
 * "fixed" ≈ own-band or non-row chrome. Everything else is "alt" (page alternation).
 */
export const SECTION_SURFACE = {
  overview: "alt",
  text_media: "alt",
  key_benefits: "alt",
  team: "alt",
  editorial_banner: "fixed",
  feature_spotlight: "alt",
  process_steps: "alt",
  cta_band: "fixed",
  contact_us: "alt",
  contact_form: "alt",
  statement_band: "fixed",
  bento_grid: "alt",
  horizon_gallery: "fixed",
  split_narrative: "alt",
  pillar_destinations: "alt",
  orbit_hero: "fixed",
  card_stack: "alt",
  feature_tabs: "alt",
  tabs_vertical: "alt",
  tabs_horizontal: "alt",
  tabs_underline: "alt",
  tabs_success_stories: "alt",
  pricing_tiers: "alt",
  masonry_quotes: "alt",
  metric_rail: "alt",
  site_builder_hero: "fixed",
  template_gallery: "fixed",
  builder_feature_cards: "alt",
  domain_search_band: "fixed",
  website_build_steps: "alt",
  video_banner: "fixed",
  cast_profiles: "alt",
  why_choose: "alt",
  stats: "alt",
  related_courses: "alt",
  curriculum: "alt",
  partners: "alt",
  partners_marquee: "alt",
  training_options: "alt",
  awards: "alt",
  in_page_nav: "fixed",
  testimonials: "alt",
  customer_testimonials: "alt",
  faq: "alt",
  resources: "alt",
  products: "alt",
  catalog: "alt",
  entity_directory: "alt",
  latest_blogs: "alt",
  blog_directory: "alt",
  hero_classic: "alt",
  hero_split: "alt",
  hero_centered: "alt",
  hero_minimal: "alt",
  hero_media: "fixed",
  hero_stats: "alt",
  hero_asymmetric: "alt",
  hero_dual_cta: "alt",
  promo_modal: "fixed",
  newsletter_band: "alt",
  form_split: "alt",
  comparison_table: "alt",
  media_mosaic: "alt",
  timeline_vertical: "alt",
  trust_badges: "alt",
  split_cta: "fixed",
  learning_path: "alt",
  faq_two_column: "alt",
};

/**
 * Sections whose UI opts into rendering `section_img_url`.
 * Others keep the field in CMS/data but ignore it in the layout.
 */
export const SECTION_USES_IMAGE = new Set([
  "overview",
  "hero_classic",
  "hero_split",
  "hero_dual_cta",
  "editorial_banner",
  "statement_band",
  "split_narrative",
  "orbit_hero",
  "site_builder_hero",
  "split_cta",
]);

/**
 * Sections whose layout uses `section_bg_img` / `section_bg_color` on the global shell.
 * All sections participate — editors can set band bg on any block.
 */
export function sectionUsesBg(_key) {
  return true;
}

/** All sections can edit section_bg_color on the global shell */
export function sectionUsesBgColor(_key) {
  return true;
}

export function sectionUsesImage(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return SECTION_USES_IMAGE.has(behavior);
}

export {
  SECTION_ITEMS_CONFIG,
  sectionUsesItems,
  getSectionItemsConfig,
  sectionRequiresItems,
  resolveSectionBehaviorKey,
};

export {
  shouldRenderPlacement,
  placementHasMeaningfulContent,
  placementHasFieldContent,
  placementHasRequiredItems,
  sectionProbeFromProps,
} from "./item-types.js";

/**
 * CMS catalog metadata. Category/tags describe the component's layout and
 * purpose, so they live beside the fixed component key rather than in editable
 * section content.
 */
export const SECTION_CATALOG = [
  { key: "overview", name: "Overview", category: "content", tags: ["text", "image"] },
  { key: "text_media", name: "Text + Media", category: "content", tags: ["text", "image"] },
  { key: "key_benefits", name: "Key Benefits", category: "features", tags: ["cards", "benefits"] },
  { key: "team", name: "Team", category: "features", tags: ["cards", "people"] },
  { key: "editorial_banner", name: "Editorial Banner", category: "hero", tags: ["hero", "full-bleed"] },
  { key: "feature_spotlight", name: "Feature Spotlight", category: "features", tags: ["cards", "spotlight"] },
  { key: "process_steps", name: "Process Steps", category: "features", tags: ["steps", "process"] },
  { key: "cta_band", name: "CTA Band", category: "cta", tags: ["cta", "band"] },
  { key: "split_cta", name: "CTA — Gradient split", category: "cta", tags: ["cta", "gradient", "image"] },
  { key: "contact_us", name: "Contact Us", category: "content", tags: ["contact", "global"], content_scope: "global" },
  { key: "contact_form", name: "Contact Form", category: "forms", tags: ["contact", "form", "enterprise"] },
  { key: "newsletter_band", name: "Newsletter Band", category: "forms", tags: ["newsletter", "capture"] },
  { key: "form_split", name: "Form — Split column", category: "forms", tags: ["form", "split", "lead"] },
  { key: "statement_band", name: "Statement Band", category: "hero", tags: ["hero", "typography"] },
  { key: "bento_grid", name: "Bento Grid", category: "features", tags: ["bento", "mosaic"] },
  { key: "horizon_gallery", name: "Horizon Gallery", category: "content", tags: ["gallery", "slider"] },
  { key: "split_narrative", name: "Split Narrative", category: "content", tags: ["story", "sticky"] },
  { key: "pillar_destinations", name: "Pillar Destinations", category: "features", tags: ["pillars", "links"] },
  { key: "orbit_hero", name: "Orbit Hero", category: "hero", tags: ["hero", "product-frame"] },
  { key: "card_stack", name: "Card Stack", category: "features", tags: ["stack", "scroll"] },
  { key: "feature_tabs", name: "Tabs — Vertical", category: "tabs", tags: ["tabs", "vertical", "preview"] },
  { key: "tabs_vertical", name: "Tabs — Vertical", category: "tabs", tags: ["tabs", "vertical"] },
  { key: "tabs_horizontal", name: "Tabs — Horizontal", category: "tabs", tags: ["tabs", "horizontal", "pills"] },
  { key: "tabs_underline", name: "Tabs — Underline", category: "tabs", tags: ["tabs", "underline", "editorial"] },
  { key: "tabs_success_stories", name: "Tabs — Success Stories", category: "tabs", tags: ["tabs", "horizontal", "icons", "case-study"] },
  { key: "pricing_tiers", name: "Pricing Tiers", category: "pricing", tags: ["pricing", "plans"] },
  { key: "masonry_quotes", name: "Masonry Quotes", category: "social_proof", tags: ["testimonials", "masonry"] },
  { key: "metric_rail", name: "Metric Rail", category: "data", tags: ["metrics", "proof"] },
  { key: "site_builder_hero", name: "Site Builder Hero", category: "hero", tags: ["builder", "hero"] },
  { key: "template_gallery", name: "Template Gallery", category: "content", tags: ["templates", "gallery"] },
  { key: "builder_feature_cards", name: "Builder Feature Cards", category: "features", tags: ["features", "cards"] },
  { key: "domain_search_band", name: "Domain Search Band", category: "content", tags: ["domain", "search"] },
  { key: "website_build_steps", name: "Website Build Steps", category: "content", tags: ["steps", "guide"] },
  { key: "video_banner", name: "Video Banner", category: "hero", tags: ["video", "full-bleed"] },
  { key: "cast_profiles", name: "Cast Profiles", category: "features", tags: ["cast", "profiles", "people"] },
  { key: "why_choose", name: "Why Choose", category: "features", tags: ["cards", "cta"] },
  { key: "stats", name: "Stats Strip", category: "data", tags: ["metrics", "strip"] },
  { key: "related_courses", name: "Related Courses", category: "catalog", tags: ["courses", "cards"] },
  { key: "curriculum", name: "Curriculum", category: "catalog", tags: ["learning", "list"] },
  { key: "partners", name: "Partners", category: "social_proof", tags: ["logos", "partners"], content_scope: "global" },
  { key: "partners_marquee", name: "Partners — Logo Marquee", category: "social_proof", tags: ["logos", "marquee"], content_scope: "global" },
  { key: "training_options", name: "Training Options", category: "features", tags: ["cards", "options"] },
  { key: "awards", name: "Awards & Recognition", category: "social_proof", tags: ["awards", "cards"] },
  { key: "in_page_nav", name: "In-Page Navigation", category: "navigation", tags: ["sticky", "links"], content_scope: "global" },
  { key: "testimonials", name: "Testimonials", category: "social_proof", tags: ["quotes", "reviews"] },
  { key: "customer_testimonials", name: "Customer Testimonials", category: "social_proof", tags: ["carousel", "reviews", "global"], content_scope: "global" },
  {
    key: "page_testimonials",
    name: "Page Testimonials",
    category: "social_proof",
    tags: ["carousel", "reviews", "page"],
    render_key: "customer_testimonials",
    content_scope: "page",
  },
  { key: "faq", name: "FAQ", category: "accordion", tags: ["accordion", "questions"] },
  { key: "faq_two_column", name: "FAQ — Split column", category: "accordion", tags: ["accordion", "split", "title-side"] },
  { key: "promo_modal", name: "Promo Modal", category: "overlays", tags: ["modal", "delay", "overlay"] },
  { key: "comparison_table", name: "Comparison Table", category: "comparison", tags: ["table", "compare"] },
  { key: "media_mosaic", name: "Media Mosaic", category: "media", tags: ["gallery", "mosaic", "images"] },
  { key: "timeline_vertical", name: "Timeline — Vertical", category: "timeline", tags: ["timeline", "journey"] },
  { key: "trust_badges", name: "Trust Badges", category: "trust", tags: ["trust", "badges", "compliance"] },
  { key: "learning_path", name: "Learning Path", category: "learning", tags: ["learning", "path", "steps"] },
  { key: "resources", name: "Resources", category: "catalog", tags: ["resources", "cards"] },
  { key: "products", name: "Products Grid", category: "catalog", tags: ["products", "grid"] },
  { key: "catalog", name: "Course Catalog", category: "catalog", tags: ["courses", "filters"] },
  {
    key: "entity_directory",
    name: "Entity Directory",
    category: "catalog",
    tags: ["directory", "filters"],
  },
  {
    key: "latest_blogs",
    name: "Latest Blogs",
    category: "content",
    tags: ["blogs", "articles", "latest"],
    content_scope: "global",
  },
  {
    key: "blog_directory",
    name: "Blog Directory",
    category: "catalog",
    tags: ["blogs", "directory", "search"],
  },
  { key: "hero_classic", name: "Hero — Classic", category: "hero", tags: ["hero", "cta"] },
  { key: "hero_split", name: "Hero — Split", category: "hero", tags: ["hero", "split"] },
  { key: "hero_centered", name: "Hero — Centered", category: "hero", tags: ["hero", "centered"] },
  { key: "hero_minimal", name: "Hero — Minimal", category: "hero", tags: ["hero", "minimal"] },
  { key: "hero_media", name: "Hero — Media Slider", category: "hero", tags: ["hero", "slider"] },
  { key: "hero_stats", name: "Hero — Stats", category: "hero", tags: ["hero", "metrics"] },
  { key: "hero_asymmetric", name: "Hero — Asymmetric", category: "hero", tags: ["hero", "asymmetric"] },
  { key: "hero_dual_cta", name: "Hero — Dual CTA", category: "hero", tags: ["hero", "cta"] },
];

export const KNOWN_SECTION_KEYS = SECTION_CATALOG.map((s) => s.key);

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

/** Fixed metadata for a registered section component. */
export function getSectionCatalogMeta(key) {
  const normalized = String(key || "").toLowerCase();
  return SECTION_CATALOG.find((section) => section.key === normalized) || null;
}

/** True when a React renderer exists for this section key (incl. render_key variants) */
export function isKnownSectionKey(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return Boolean(SECTION_SURFACE[behavior]);
}
