"use client";

import dynamic from "next/dynamic";
import { resolveSectionBehaviorKey } from "./section-items-config.js";

/** Behavior key → dynamic import (chunks load only when a section renders). */
const SECTION_IMPORTS = {
  overview: () => import("@/components/sections/content/OverviewSection"),
  text_media: () => import("@/components/sections/content/text-media/TextMediaSection"),
  key_benefits: () => import("@/components/sections/features/KeyBenefitsSection"),
  team: () => import("@/components/sections/features/TeamSection"),
  editorial_banner: () => import("@/components/sections/hero/EditorialBannerSection"),
  feature_spotlight: () => import("@/components/sections/features/FeatureSpotlightSection"),
  process_steps: () => import("@/components/sections/features/ProcessStepsSection"),
  cta_band: () => import("@/components/sections/content/CtaBandSection"),
  contact_us: () => import("@/components/sections/content/ContactUsSection"),
  contact_form: () => import("@/components/sections/content/ContactFormSection"),
  statement_band: () => import("@/components/sections/hero/StatementBandSection"),
  bento_grid: () => import("@/components/sections/features/BentoGridSection"),
  horizon_gallery: () => import("@/components/sections/content/HorizonGallerySection"),
  split_narrative: () => import("@/components/sections/content/SplitNarrativeSection"),
  pillar_destinations: () => import("@/components/sections/features/PillarDestinationsSection"),
  orbit_hero: () => import("@/components/sections/hero/OrbitHeroSection"),
  card_stack: () => import("@/components/sections/features/CardStackSection"),
  feature_tabs: () => import("@/components/sections/tabs/FeatureTabsSection"),
  tabs_horizontal: () => import("@/components/sections/tabs/TabsHorizontalSection"),
  tabs_underline: () => import("@/components/sections/tabs/TabsUnderlineSection"),
  tabs_success_stories: () => import("@/components/sections/tabs/TabsSuccessStoriesSection"),
  pricing_tiers: () => import("@/components/sections/content/PricingTiersSection"),
  masonry_quotes: () => import("@/components/sections/social_proof/MasonryQuotesSection"),
  metric_rail: () => import("@/components/sections/data/MetricRailSection"),
  site_builder_hero: () => import("@/components/sections/hero/SiteBuilderHeroSection"),
  template_gallery: () => import("@/components/sections/content/TemplateGallerySection"),
  builder_feature_cards: () => import("@/components/sections/features/BuilderFeatureCardsSection"),
  domain_search_band: () => import("@/components/sections/content/DomainSearchBandSection"),
  website_build_steps: () => import("@/components/sections/content/WebsiteBuildStepsSection"),
  video_banner: () => import("@/components/sections/hero/VideoBannerSection"),
  cast_profiles: () => import("@/components/sections/features/CastProfilesSection"),
  why_choose: () => import("@/components/sections/features/WhyChooseSection"),
  stats: () => import("@/components/sections/data/StatsSection"),
  related_courses: () => import("@/components/sections/catalog/RelatedCoursesSection"),
  curriculum: () => import("@/components/sections/catalog/CurriculumSection"),
  partners_marquee: () => import("@/components/sections/social_proof/partners/PartnersMarqueeSection"),
  training_options: () => import("@/components/sections/features/cards/TrainingOptionsSection"),
  awards: () => import("@/components/sections/features/cards/AwardsSection"),
  in_page_nav: () => import("@/components/sections/navigation/InPageNavSection"),
  testimonials: () => import("@/components/sections/social_proof/TestimonialsSection"),
  customer_testimonials: () =>
    import("@/components/sections/social_proof/testimonials/CustomerTestimonialsCarousel"),
  faq: () => import("@/components/sections/accordion/FaqSection"),
  resources: () => import("@/components/sections/catalog/ResourcesSection"),
  products: () => import("@/components/sections/catalog/ProductsSection"),
  catalog: () => import("@/components/sections/catalog/CatalogSection"),
  entity_directory: () => import("@/components/sections/catalog/EntityDirectorySection"),
  latest_blogs: () => import("@/components/sections/content/LatestBlogsSection"),
  blog_directory: () => import("@/components/sections/catalog/BlogDirectorySection"),
  hero_classic: () => import("@/components/sections/hero/HeroClassicSection"),
  hero_split: () => import("@/components/sections/hero/HeroSplitSection"),
  hero_centered: () => import("@/components/sections/hero/HeroCenteredSection"),
  hero_minimal: () => import("@/components/sections/hero/HeroMinimalSection"),
  hero_media: () => import("@/components/sections/hero/HeroMediaSection"),
  hero_stats: () => import("@/components/sections/hero/HeroStatsSection"),
  hero_asymmetric: () => import("@/components/sections/hero/HeroAsymmetricSection"),
  hero_dual_cta: () => import("@/components/sections/hero/HeroDualCtaSection"),
  promo_modal: () => import("@/components/sections/overlays/PromoModalSection"),
  newsletter_band: () => import("@/components/sections/forms/NewsletterBandSection"),
  form_split: () => import("@/components/sections/forms/FormSplitSection"),
  comparison_table: () => import("@/components/sections/comparison/ComparisonTableSection"),
  media_mosaic: () => import("@/components/sections/media/MediaMosaicSection"),
  timeline_vertical: () => import("@/components/sections/timeline/TimelineVerticalSection"),
  trust_badges: () => import("@/components/sections/trust/TrustBadgesSection"),
  split_cta: () => import("@/components/sections/cta/SplitCtaSection"),
  learning_path: () => import("@/components/sections/learning/LearningPathSection"),
  faq_two_column: () => import("@/components/sections/accordion/FaqTwoColumnSection"),
};

const lazyComponentCache = new Map();

export function resolveLazySectionComponent(sectionKey, renderKey) {
  const behavior = resolveSectionBehaviorKey(sectionKey, renderKey);
  const loader = SECTION_IMPORTS[behavior];
  if (!loader) return null;

  if (!lazyComponentCache.has(behavior)) {
    lazyComponentCache.set(
      behavior,
      dynamic(loader, { loading: () => null })
    );
  }

  return lazyComponentCache.get(behavior);
}
