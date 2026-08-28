"use client";

import dynamic from "next/dynamic";
import { resolveSectionBehaviorKey } from "./section-items-config.js";

/** Behavior key → dynamic import (chunks load only when a section renders). */
const SECTION_IMPORTS = {
  overview: () =>
    import("@/components/sections/content/overview/OverviewPublicSection"),
  text_media: () =>
    import(
      "@/components/sections/content/text-media/TextMediaPublicSection"
    ),
  key_benefits: () =>
    import(
      "@/components/sections/features/key-benefits/KeyBenefitsPublicSection"
    ),
  team: () =>
    import("@/components/sections/features/team/TeamPublicSection"),
  editorial_banner: () =>
    import(
      "@/components/sections/hero/editorial-banner/EditorialBannerPublicSection"
    ),
  feature_spotlight: () =>
    import(
      "@/components/sections/features/feature-spotlight/FeatureSpotlightPublicSection"
    ),
  process_steps: () =>
    import(
      "@/components/sections/features/process-steps/ProcessStepsPublicSection"
    ),
  cta_band: () =>
    import("@/components/sections/content/cta-band/CtaBandPublicSection"),
  contact_us: () =>
    import("@/components/sections/content/contact-us/ContactUsPublicSection"),
  contact_form: () =>
    import("@/components/sections/content/contact-form/ContactFormPublicSection"),
  statement_band: () =>
    import(
      "@/components/sections/hero/statement-band/StatementBandPublicSection"
    ),
  bento_grid: () =>
    import("@/components/sections/features/bento-grid/BentoGridPublicSection"),
  horizon_gallery: () =>
    import(
      "@/components/sections/content/horizon-gallery/HorizonGalleryPublicSection"
    ),
  split_narrative: () =>
    import(
      "@/components/sections/content/split-narrative/SplitNarrativePublicSection"
    ),
  pillar_destinations: () =>
    import(
      "@/components/sections/features/pillar-destinations/PillarDestinationsPublicSection"
    ),
  orbit_hero: () =>
    import("@/components/sections/hero/orbit-hero/OrbitHeroPublicSection"),
  card_stack: () =>
    import("@/components/sections/features/card-stack/CardStackPublicSection"),
  feature_tabs: () =>
    import(
      "@/components/sections/tabs/feature-tabs/FeatureTabsPublicSection"
    ),
  tabs_horizontal: () =>
    import(
      "@/components/sections/tabs/tabs-horizontal/TabsHorizontalPublicSection"
    ),
  tabs_underline: () =>
    import(
      "@/components/sections/tabs/tabs-underline/TabsUnderlinePublicSection"
    ),
  tabs_success_stories: () =>
    import(
      "@/components/sections/tabs/success-stories/TabsSuccessStoriesPublicSection"
    ),
  pricing_tiers: () =>
    import(
      "@/components/sections/content/pricing-tiers/PricingTiersPublicSection"
    ),
  masonry_quotes: () =>
    import(
      "@/components/sections/social_proof/masonry-quotes/MasonryQuotesPublicSection"
    ),
  metric_rail: () =>
    import(
      "@/components/sections/data/metric-rail/MetricRailPublicSection"
    ),
  site_builder_hero: () =>
    import(
      "@/components/sections/hero/site-builder-hero/SiteBuilderHeroPublicSection"
    ),
  template_gallery: () =>
    import(
      "@/components/sections/content/template-gallery/TemplateGalleryPublicSection"
    ),
  builder_feature_cards: () =>
    import(
      "@/components/sections/features/builder-feature-cards/BuilderFeatureCardsPublicSection"
    ),
  domain_search_band: () =>
    import(
      "@/components/sections/content/domain-search-band/DomainSearchBandPublicSection"
    ),
  website_build_steps: () =>
    import(
      "@/components/sections/content/website-build-steps/WebsiteBuildStepsPublicSection"
    ),
  video_banner: () =>
    import("@/components/sections/hero/video-banner/VideoBannerPublicSection"),
  cast_profiles: () =>
    import(
      "@/components/sections/features/cast-profiles/CastProfilesPublicSection"
    ),
  why_choose: () =>
    import(
      "@/components/sections/features/why-choose/WhyChoosePublicSection"
    ),
  stats: () =>
    import("@/components/sections/data/stats/StatsPublicSection"),
  related_courses: () =>
    import(
      "@/components/sections/catalog/related-courses/RelatedCoursesPublicSection"
    ),
  curriculum: () =>
    import(
      "@/components/sections/catalog/curriculum/CurriculumPublicSection"
    ),
  partners_marquee: () =>
    import(
      "@/components/sections/social_proof/partners-marquee/PartnersMarqueePublicSection"
    ),
  training_options: () =>
    import(
      "@/components/sections/features/training-options/TrainingOptionsPublicSection"
    ),
  awards: () =>
    import("@/components/sections/features/awards/AwardsPublicSection"),
  in_page_nav: () =>
    import(
      "@/components/sections/navigation/in-page-nav/InPageNavPublicSection"
    ),
  testimonials: () =>
    import(
      "@/components/sections/social_proof/testimonials/TestimonialsPublicSection"
    ),
  customer_testimonials: () =>
    import(
      "@/components/sections/social_proof/customer-testimonials/CustomerTestimonialsPublicSection"
    ),
  faq: () => import("@/components/sections/accordion/faq/FaqPublicSection"),
  resources: () =>
    import(
      "@/components/sections/catalog/resources/ResourcesPublicSection"
    ),
  products: () =>
    import("@/components/sections/catalog/products/ProductsPublicSection"),
  catalog: () =>
    import(
      "@/components/sections/catalog/course-catalog/CourseCatalogPublicSection"
    ),
  entity_directory: () =>
    import(
      "@/components/sections/catalog/entity-directory/EntityDirectoryPublicSection"
    ),
  latest_blogs: () =>
    import("@/components/sections/content/latest-blogs/LatestBlogsPublicSection"),
  blog_directory: () =>
    import(
      "@/components/sections/catalog/blog-directory/BlogDirectoryPublicSection"
    ),
  hero_classic: () =>
    import("@/components/sections/hero/hero-classic/HeroClassicPublicSection"),
  hero_split: () =>
    import("@/components/sections/hero/hero-split/HeroSplitPublicSection"),
  hero_centered: () =>
    import("@/components/sections/hero/hero-centered/HeroCenteredPublicSection"),
  hero_minimal: () =>
    import("@/components/sections/hero/hero-minimal/HeroMinimalPublicSection"),
  hero_media: () =>
    import("@/components/sections/hero/hero-media/HeroMediaPublicSection"),
  hero_stats: () =>
    import("@/components/sections/hero/hero-stats/HeroStatsPublicSection"),
  hero_asymmetric: () =>
    import("@/components/sections/hero/hero-asymmetric/HeroAsymmetricPublicSection"),
  hero_dual_cta: () =>
    import("@/components/sections/hero/hero-dual-cta/HeroDualCtaPublicSection"),
  promo_modal: () =>
    import(
      "@/components/sections/overlays/promo-modal/PromoModalPublicSection"
    ),
  newsletter_band: () =>
    import(
      "@/components/sections/forms/newsletter-band/NewsletterBandPublicSection"
    ),
  form_split: () =>
    import("@/components/sections/forms/form-split/FormSplitPublicSection"),
  comparison_table: () =>
    import(
      "@/components/sections/comparison/comparison-table/ComparisonTablePublicSection"
    ),
  media_mosaic: () =>
    import(
      "@/components/sections/media/media-mosaic/MediaMosaicPublicSection"
    ),
  timeline_vertical: () =>
    import(
      "@/components/sections/timeline/timeline-vertical/TimelineVerticalPublicSection"
    ),
  trust_badges: () =>
    import(
      "@/components/sections/trust/trust-badges/TrustBadgesPublicSection"
    ),
  split_cta: () =>
    import("@/components/sections/cta/split-cta/SplitCtaPublicSection"),
  learning_path: () =>
    import(
      "@/components/sections/learning/learning-path/LearningPathPublicSection"
    ),
  faq_two_column: () =>
    import("@/components/sections/accordion/faq-two-column/FaqTwoColumnPublicSection"),
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
