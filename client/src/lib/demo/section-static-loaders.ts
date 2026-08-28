import type { ComponentType } from "react";

export type DemoStaticComponent = ComponentType<{ id?: string }>;

type StaticModule = { default: DemoStaticComponent };

/**
 * Lazy loaders for demo Static components — direct paths so each preview
 * loads in isolation (avoids eager SSR imports that break on mixed JS/TS).
 */
export const SECTION_STATIC_LOADERS: Record<
  string,
  () => Promise<StaticModule>
> = {
  overview: () =>
    import("@/components/sections/content/overview/OverviewStatic"),
  text_media: () =>
    import("@/components/sections/content/text-media/TextMediaStatic"),
  key_benefits: () =>
    import("@/components/sections/features/key-benefits/KeyBenefitsStatic"),
  team: () => import("@/components/sections/features/team/TeamStatic"),
  editorial_banner: () =>
    import("@/components/sections/hero/editorial-banner/EditorialBannerStatic"),
  feature_spotlight: () =>
    import("@/components/sections/features/feature-spotlight/FeatureSpotlightStatic"),
  process_steps: () =>
    import("@/components/sections/features/process-steps/ProcessStepsStatic"),
  cta_band: () =>
    import("@/components/sections/content/cta-band/CtaBandStatic"),
  split_cta: () =>
    import("@/components/sections/cta/split-cta/SplitCtaStatic"),
  contact_us: () =>
    import("@/components/sections/content/contact-us/ContactUsStatic"),
  contact_form: () =>
    import("@/components/sections/content/contact-form/ContactFormStatic"),
  newsletter_band: () =>
    import("@/components/sections/forms/newsletter-band/NewsletterBandStatic"),
  form_split: () =>
    import("@/components/sections/forms/form-split/FormSplitStatic"),
  statement_band: () =>
    import("@/components/sections/hero/statement-band/StatementBandStatic"),
  bento_grid: () =>
    import("@/components/sections/features/bento-grid/BentoGridStatic"),
  horizon_gallery: () =>
    import("@/components/sections/content/horizon-gallery/HorizonGalleryStatic"),
  split_narrative: () =>
    import("@/components/sections/content/split-narrative/SplitNarrativeStatic"),
  pillar_destinations: () =>
    import("@/components/sections/features/pillar-destinations/PillarDestinationsStatic"),
  orbit_hero: () =>
    import("@/components/sections/hero/orbit-hero/OrbitHeroStatic"),
  card_stack: () =>
    import("@/components/sections/features/card-stack/CardStackStatic"),
  feature_tabs: () =>
    import("@/components/sections/tabs/feature-tabs/FeatureTabsStatic"),
  tabs_vertical: () =>
    import("@/components/sections/tabs/feature-tabs/FeatureTabsStatic"),
  tabs_horizontal: () =>
    import("@/components/sections/tabs/tabs-horizontal/TabsHorizontalStatic"),
  tabs_underline: () =>
    import("@/components/sections/tabs/tabs-underline/TabsUnderlineStatic"),
  tabs_success_stories: () =>
    import("@/components/sections/tabs/success-stories/TabsSuccessStoriesStatic"),
  pricing_tiers: () =>
    import("@/components/sections/content/pricing-tiers/PricingTiersStatic"),
  masonry_quotes: () =>
    import("@/components/sections/social_proof/masonry-quotes/MasonryQuotesStatic"),
  metric_rail: () =>
    import("@/components/sections/data/metric-rail/MetricRailStatic"),
  site_builder_hero: () =>
    import("@/components/sections/hero/site-builder-hero/SiteBuilderHeroStatic"),
  template_gallery: () =>
    import("@/components/sections/content/template-gallery/TemplateGalleryStatic"),
  builder_feature_cards: () =>
    import("@/components/sections/features/builder-feature-cards/BuilderFeatureCardsStatic"),
  domain_search_band: () =>
    import("@/components/sections/content/domain-search-band/DomainSearchBandStatic"),
  website_build_steps: () =>
    import("@/components/sections/content/website-build-steps/WebsiteBuildStepsStatic"),
  video_banner: () =>
    import("@/components/sections/hero/video-banner/VideoBannerStatic"),
  cast_profiles: () =>
    import("@/components/sections/features/cast-profiles/CastProfilesStatic"),
  why_choose: () =>
    import("@/components/sections/features/why-choose/WhyChooseStatic"),
  stats: () => import("@/components/sections/data/stats/StatsStatic"),
  curriculum: () =>
    import("@/components/sections/catalog/curriculum/CurriculumStatic"),
  partners: () =>
    import("@/components/sections/social_proof/partners-marquee/PartnersMarqueeStatic"),
  partners_marquee: () =>
    import("@/components/sections/social_proof/partners-marquee/PartnersMarqueeStatic"),
  training_options: () =>
    import("@/components/sections/features/training-options/TrainingOptionsStatic"),
  awards: () =>
    import("@/components/sections/features/awards/AwardsStatic"),
  in_page_nav: () =>
    import("@/components/sections/navigation/in-page-nav/InPageNavStatic"),
  testimonials: () =>
    import("@/components/sections/social_proof/testimonials/TestimonialsStatic"),
  customer_testimonials: () =>
    import("@/components/sections/social_proof/customer-testimonials/CustomerTestimonialsStatic"),
  page_testimonials: () =>
    import("@/components/sections/social_proof/customer-testimonials/CustomerTestimonialsStatic"),
  faq: () => import("@/components/sections/accordion/faq/FaqStatic"),
  faq_two_column: () =>
    import("@/components/sections/accordion/faq-two-column/FaqTwoColumnStatic"),
  comparison_table: () =>
    import("@/components/sections/comparison/comparison-table/ComparisonTableStatic"),
  media_mosaic: () =>
    import("@/components/sections/media/media-mosaic/MediaMosaicStatic"),
  timeline_vertical: () =>
    import("@/components/sections/timeline/timeline-vertical/TimelineVerticalStatic"),
  trust_badges: () =>
    import("@/components/sections/trust/trust-badges/TrustBadgesStatic"),
  learning_path: () =>
    import("@/components/sections/learning/learning-path/LearningPathStatic"),
  resources: () =>
    import("@/components/sections/catalog/resources/ResourcesStatic"),
  latest_blogs: () =>
    import("@/components/sections/content/latest-blogs/LatestBlogsStatic"),
  hero_classic: () =>
    import("@/components/sections/hero/hero-classic/HeroClassicStatic"),
  hero_split: () =>
    import("@/components/sections/hero/hero-split/HeroSplitStatic"),
  hero_centered: () =>
    import("@/components/sections/hero/hero-centered/HeroCenteredStatic"),
  hero_minimal: () =>
    import("@/components/sections/hero/hero-minimal/HeroMinimalStatic"),
  hero_media: () =>
    import("@/components/sections/hero/hero-media/HeroMediaStatic"),
  hero_stats: () =>
    import("@/components/sections/hero/hero-stats/HeroStatsStatic"),
  hero_asymmetric: () =>
    import("@/components/sections/hero/hero-asymmetric/HeroAsymmetricStatic"),
  hero_dual_cta: () =>
    import("@/components/sections/hero/hero-dual-cta/HeroDualCtaStatic"),
};
