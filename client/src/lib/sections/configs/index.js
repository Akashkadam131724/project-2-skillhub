/**

 * Registry of section-owned CMS item configs.

 *

 * Import from each variant's lib/cms-config.js — not from category shared/.

 *

 * Add new sections:

 *   1. Create `components/sections/<category>/<variant>/lib/cms-config.js`

 *   2. Import + add to SECTION_COMPONENT_ITEM_CONFIGS below

 */

import { FAQ_ITEMS_CONFIG } from "@/components/sections/accordion/faq/lib/cms-config.js";

import { FAQ_TWO_COLUMN_ITEMS_CONFIG } from "@/components/sections/accordion/faq-two-column/lib/cms-config.js";

import { CURRICULUM_ITEMS_CONFIG } from "@/components/sections/catalog/curriculum/lib/cms-config.js";

import { RESOURCES_ITEMS_CONFIG } from "@/components/sections/catalog/resources/lib/cms-config.js";

import { COMPARISON_TABLE_ITEMS_CONFIG } from "@/components/sections/comparison/comparison-table/lib/cms-config.js";

import { CONTACT_FORM_ITEMS_CONFIG } from "@/components/sections/content/contact-form/lib/cms-config.js";

import { CONTACT_US_ITEMS_CONFIG } from "@/components/sections/content/contact-us/lib/cms-config.js";

import { DOMAIN_SEARCH_BAND_ITEMS_CONFIG } from "@/components/sections/content/domain-search-band/lib/cms-config.js";

import { HORIZON_GALLERY_ITEMS_CONFIG } from "@/components/sections/content/horizon-gallery/lib/cms-config.js";

import { PRICING_TIERS_ITEMS_CONFIG } from "@/components/sections/content/pricing-tiers/lib/cms-config.js";

import { SPLIT_NARRATIVE_ITEMS_CONFIG } from "@/components/sections/content/split-narrative/lib/cms-config.js";

import { TEMPLATE_GALLERY_ITEMS_CONFIG } from "@/components/sections/content/template-gallery/lib/cms-config.js";

import { TEXT_MEDIA_ITEMS_CONFIG } from "@/components/sections/content/text-media/lib/cms-config.js";

import { VENDOR_LINK_GRID_ITEMS_CONFIG } from "@/components/sections/content/vendor-links-grid/lib/cms-config.js";
import { SARDER_ECOSYSTEM_ITEMS_CONFIG } from "@/components/sections/content/sarder-ecosystem/lib/cms-config.js";

import { WEBSITE_BUILD_STEPS_ITEMS_CONFIG } from "@/components/sections/content/website-build-steps/lib/cms-config.js";

import { METRIC_RAIL_ITEMS_CONFIG } from "@/components/sections/data/metric-rail/lib/cms-config.js";

import { STATS_ITEMS_CONFIG } from "@/components/sections/data/stats/lib/cms-config.js";

import { AWARDS_ITEMS_CONFIG } from "@/components/sections/features/awards/lib/cms-config.js";

import { BENTO_GRID_ITEMS_CONFIG } from "@/components/sections/features/bento-grid/lib/cms-config.js";

import { BUILDER_FEATURE_CARDS_ITEMS_CONFIG } from "@/components/sections/features/builder-feature-cards/lib/cms-config.js";

import { CARD_STACK_ITEMS_CONFIG } from "@/components/sections/features/card-stack/lib/cms-config.js";

import { CAST_PROFILES_ITEMS_CONFIG } from "@/components/sections/features/cast-profiles/lib/cms-config.js";

import { FEATURE_SPOTLIGHT_ITEMS_CONFIG } from "@/components/sections/features/feature-spotlight/lib/cms-config.js";

import { KEY_BENEFITS_ITEMS_CONFIG } from "@/components/sections/features/key-benefits/lib/cms-config.js";

import { PILLAR_DESTINATIONS_ITEMS_CONFIG } from "@/components/sections/features/pillar-destinations/lib/cms-config.js";

import { PROCESS_STEPS_ITEMS_CONFIG } from "@/components/sections/features/process-steps/lib/cms-config.js";

import { TEAM_ITEMS_CONFIG } from "@/components/sections/features/team/lib/cms-config.js";

import { TRAINING_OPTIONS_ITEMS_CONFIG } from "@/components/sections/features/training-options/lib/cms-config.js";

import { WHY_CHOOSE_ITEMS_CONFIG } from "@/components/sections/features/why-choose/lib/cms-config.js";

import { FORM_SPLIT_ITEMS_CONFIG } from "@/components/sections/forms/form-split/lib/cms-config.js";

import { TRUST_BADGES_ITEMS_CONFIG } from "@/components/sections/trust/trust-badges/lib/cms-config.js";

import { TIMELINE_VERTICAL_ITEMS_CONFIG } from "@/components/sections/timeline/timeline-vertical/lib/cms-config.js";

import {
  FEATURE_TABS_ITEMS_CONFIG,
  TABS_VERTICAL_ITEMS_CONFIG,
} from "@/components/sections/tabs/feature-tabs/lib/cms-config.js";

import { TABS_HORIZONTAL_ITEMS_CONFIG } from "@/components/sections/tabs/tabs-horizontal/lib/cms-config.js";

import { TABS_UNDERLINE_ITEMS_CONFIG } from "@/components/sections/tabs/tabs-underline/lib/cms-config.js";

import { TABS_SUCCESS_STORIES_ITEMS_CONFIG } from "@/components/sections/tabs/success-stories/lib/cms-config.js";

import { MASONRY_QUOTES_ITEMS_CONFIG } from "@/components/sections/social_proof/masonry-quotes/lib/cms-config.js";

import { TESTIMONIALS_ITEMS_CONFIG } from "@/components/sections/social_proof/testimonials/lib/cms-config.js";

import { CUSTOMER_TESTIMONIALS_ITEMS_CONFIG } from "@/components/sections/social_proof/customer-testimonials/lib/cms-config.js";

import { PARTNERS_MARQUEE_ITEMS_CONFIG } from "@/components/sections/social_proof/partners-marquee/lib/cms-config.js";

import { MEDIA_MOSAIC_ITEMS_CONFIG } from "@/components/sections/media/media-mosaic/lib/cms-config.js";

import { LEARNING_PATH_ITEMS_CONFIG } from "@/components/sections/learning/learning-path/lib/cms-config.js";

import { HERO_STATS_ITEMS_CONFIG } from "@/components/sections/hero/hero-stats/lib/cms-config.js";

import { HERO_MEDIA_ITEMS_CONFIG } from "@/components/sections/hero/hero-media/lib/cms-config.js";

import { VIDEO_BANNER_ITEMS_CONFIG } from "@/components/sections/hero/video-banner/lib/cms-config.js";

/** Section-owned CMS item configs (merged into SECTION_ITEMS_CONFIG). */

export const SECTION_COMPONENT_ITEM_CONFIGS = {

  faq: FAQ_ITEMS_CONFIG,

  faq_two_column: FAQ_TWO_COLUMN_ITEMS_CONFIG,

  curriculum: CURRICULUM_ITEMS_CONFIG,

  resources: RESOURCES_ITEMS_CONFIG,

  comparison_table: COMPARISON_TABLE_ITEMS_CONFIG,

  contact_form: CONTACT_FORM_ITEMS_CONFIG,

  contact_us: CONTACT_US_ITEMS_CONFIG,

  domain_search_band: DOMAIN_SEARCH_BAND_ITEMS_CONFIG,

  horizon_gallery: HORIZON_GALLERY_ITEMS_CONFIG,

  metric_rail: METRIC_RAIL_ITEMS_CONFIG,

  split_narrative: SPLIT_NARRATIVE_ITEMS_CONFIG,

  stats: STATS_ITEMS_CONFIG,

  template_gallery: TEMPLATE_GALLERY_ITEMS_CONFIG,

  text_media: TEXT_MEDIA_ITEMS_CONFIG,

  vendor_link_grid: VENDOR_LINK_GRID_ITEMS_CONFIG,

  sarder_ecosystem: SARDER_ECOSYSTEM_ITEMS_CONFIG,

  pricing_tiers: PRICING_TIERS_ITEMS_CONFIG,

  website_build_steps: WEBSITE_BUILD_STEPS_ITEMS_CONFIG,

  awards: AWARDS_ITEMS_CONFIG,

  bento_grid: BENTO_GRID_ITEMS_CONFIG,

  builder_feature_cards: BUILDER_FEATURE_CARDS_ITEMS_CONFIG,

  card_stack: CARD_STACK_ITEMS_CONFIG,

  cast_profiles: CAST_PROFILES_ITEMS_CONFIG,

  feature_spotlight: FEATURE_SPOTLIGHT_ITEMS_CONFIG,

  form_split: FORM_SPLIT_ITEMS_CONFIG,

  key_benefits: KEY_BENEFITS_ITEMS_CONFIG,

  pillar_destinations: PILLAR_DESTINATIONS_ITEMS_CONFIG,

  process_steps: PROCESS_STEPS_ITEMS_CONFIG,

  team: TEAM_ITEMS_CONFIG,

  feature_tabs: FEATURE_TABS_ITEMS_CONFIG,

  tabs_vertical: TABS_VERTICAL_ITEMS_CONFIG,

  tabs_horizontal: TABS_HORIZONTAL_ITEMS_CONFIG,

  tabs_underline: TABS_UNDERLINE_ITEMS_CONFIG,

  tabs_success_stories: TABS_SUCCESS_STORIES_ITEMS_CONFIG,

  masonry_quotes: MASONRY_QUOTES_ITEMS_CONFIG,

  testimonials: TESTIMONIALS_ITEMS_CONFIG,

  customer_testimonials: CUSTOMER_TESTIMONIALS_ITEMS_CONFIG,

  partners_marquee: PARTNERS_MARQUEE_ITEMS_CONFIG,

  media_mosaic: MEDIA_MOSAIC_ITEMS_CONFIG,

  learning_path: LEARNING_PATH_ITEMS_CONFIG,

  hero_stats: HERO_STATS_ITEMS_CONFIG,

  hero_media: HERO_MEDIA_ITEMS_CONFIG,

  video_banner: VIDEO_BANNER_ITEMS_CONFIG,

  timeline_vertical: TIMELINE_VERTICAL_ITEMS_CONFIG,

  training_options: TRAINING_OPTIONS_ITEMS_CONFIG,

  trust_badges: TRUST_BADGES_ITEMS_CONFIG,

  why_choose: WHY_CHOOSE_ITEMS_CONFIG,

};

