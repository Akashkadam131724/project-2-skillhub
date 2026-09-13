/**
 * Showcase catalog index — category order + display names.
 * Names come from SECTION_CATALOG (single source of truth).
 */
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
} from "@/lib/sections/section-registry";

/** URL slug per category key */
export const CATEGORY_SLUG: Record<string, string> = {
  hero: "hero",
  content: "content",
  features: "features",
  tabs: "tabs",
  accordion: "accordion",
  catalog: "catalog",
  social_proof: "social-proof",
  data: "data",
  navigation: "navigation",
  overlays: "overlays",
  forms: "forms",
  comparison: "comparison",
  media: "media",
  timeline: "timeline",
  pricing: "pricing",
  trust: "trust",
  cta: "cta",
  learning: "learning",
};

/** Preferred render order within each category (library cards). */
export const SECTIONS_BY_CATEGORY: Record<string, string[]> = {
  hero: [
    "hero_classic",
    "hero_split",
    "hero_centered",
    "hero_minimal",
    "hero_media",
    "hero_stats",
    "hero_asymmetric",
    "hero_dual_cta",
    "editorial_banner",
    "statement_band",
    "orbit_hero",
    "site_builder_hero",
    "video_banner",
    "hero_gradient_slider",
  ],
  content: [
    "overview",
    "text_media",
    "horizon_gallery",
    "split_narrative",
    "template_gallery",
    "domain_search_band",
    "website_build_steps",
    "latest_blogs",
    "contact_us",
    "vendor_link_grid",
  ],
  features: [
    "key_benefits",
    "why_choose",
    "feature_spotlight",
    "process_steps",
    "training_options",
    "team",
    "bento_grid",
    "pillar_destinations",
    "card_stack",
    "builder_feature_cards",
    "cast_profiles",
  ],
  tabs: [
    "feature_tabs",
    "tabs_vertical",
    "tabs_horizontal",
    "tabs_underline",
    "tabs_success_stories",
  ],
  accordion: ["faq", "faq_two_column"],
  catalog: [
    "related_courses",
    "curriculum",
    "resources",
    "products",
    "catalog",
    "entity_directory",
    "blog_directory",
  ],
  social_proof: [
    "testimonials",
    "customer_testimonials",
    "masonry_quotes",
    "partners",
    "partners_marquee",
    "awards",
  ],
  data: ["stats", "metric_rail"],
  navigation: ["in_page_nav"],
  overlays: ["promo_modal"],
  forms: ["contact_form", "newsletter_band", "form_split"],
  comparison: ["comparison_table"],
  media: ["media_mosaic"],
  timeline: ["timeline_vertical"],
  pricing: ["pricing_tiers"],
  trust: ["trust_badges"],
  cta: ["cta_band", "split_cta"],
  learning: ["learning_path"],
};

export const SECTION_NAMES: Record<string, string> = Object.fromEntries(
  SECTION_CATALOG.map((entry) => [entry.key, entry.name])
);

export function sectionsInCategory(categoryKey: string) {
  const keys = SECTIONS_BY_CATEGORY[categoryKey];
  if (keys?.length) {
    return keys.filter((key) =>
      SECTION_CATALOG.some((entry) => entry.key === key)
    );
  }
  return SECTION_CATALOG.filter((entry) => entry.category === categoryKey)
    .map((entry) => entry.key)
    .sort();
}

export { SECTION_CATEGORIES };
