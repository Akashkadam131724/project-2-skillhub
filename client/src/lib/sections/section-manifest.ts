import { defineSection, type SectionManifestEntry } from "./section-manifest-types";

/**
 * Single registry — public + static import paths per behavior key.
 * Add a section here once; loaders and user-guide read from this file.
 */
export const SECTION_MANIFEST: Record<string, SectionManifestEntry> = {
  awards: defineSection(
    () => import("@/components/sections/features/awards/AwardsPublicSection"),
    { loadStatic: () => import("@/components/sections/features/awards/AwardsStatic") }
  ),
  bento_grid: defineSection(
    () => import("@/components/sections/features/bento-grid/BentoGridPublicSection"),
    { loadStatic: () => import("@/components/sections/features/bento-grid/BentoGridStatic") }
  ),
  blog_directory: defineSection(
    () => import("@/components/sections/catalog/blog-directory/BlogDirectoryPublicSection"),
    { userGuide: "unavailable" }
  ),
  builder_feature_cards: defineSection(
    () => import("@/components/sections/features/builder-feature-cards/BuilderFeatureCardsPublicSection"),
    { loadStatic: () => import("@/components/sections/features/builder-feature-cards/BuilderFeatureCardsStatic") }
  ),
  card_stack: defineSection(
    () => import("@/components/sections/features/card-stack/CardStackPublicSection"),
    { loadStatic: () => import("@/components/sections/features/card-stack/CardStackStatic") }
  ),
  cast_profiles: defineSection(
    () => import("@/components/sections/features/cast-profiles/CastProfilesPublicSection"),
    { loadStatic: () => import("@/components/sections/features/cast-profiles/CastProfilesStatic") }
  ),
  catalog: defineSection(
    () => import("@/components/sections/catalog/course-catalog/CourseCatalogPublicSection"),
    { userGuide: "unavailable" }
  ),
  comparison_table: defineSection(
    () => import("@/components/sections/comparison/comparison-table/ComparisonTablePublicSection"),
    { loadStatic: () => import("@/components/sections/comparison/comparison-table/ComparisonTableStatic") }
  ),
  contact_form: defineSection(
    () => import("@/components/sections/content/contact-form/ContactFormPublicSection"),
    { loadStatic: () => import("@/components/sections/content/contact-form/ContactFormStatic") }
  ),
  contact_us: defineSection(
    () => import("@/components/sections/content/contact-us/ContactUsPublicSection"),
    { loadStatic: () => import("@/components/sections/content/contact-us/ContactUsStatic") }
  ),
  cta_band: defineSection(
    () => import("@/components/sections/content/cta-band/CtaBandPublicSection"),
    { loadStatic: () => import("@/components/sections/content/cta-band/CtaBandStatic") }
  ),
  curriculum: defineSection(
    () => import("@/components/sections/catalog/curriculum/CurriculumPublicSection"),
    { loadStatic: () => import("@/components/sections/catalog/curriculum/CurriculumStatic") }
  ),
  customer_testimonials: defineSection(
    () => import("@/components/sections/social_proof/customer-testimonials/CustomerTestimonialsPublicSection"),
    { loadStatic: () => import("@/components/sections/social_proof/customer-testimonials/CustomerTestimonialsStatic") }
  ),
  domain_search_band: defineSection(
    () => import("@/components/sections/content/domain-search-band/DomainSearchBandPublicSection"),
    { loadStatic: () => import("@/components/sections/content/domain-search-band/DomainSearchBandStatic") }
  ),
  editorial_banner: defineSection(
    () => import("@/components/sections/hero/editorial-banner/EditorialBannerPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/editorial-banner/EditorialBannerStatic") }
  ),
  entity_directory: defineSection(
    () => import("@/components/sections/catalog/entity-directory/EntityDirectoryPublicSection"),
    { userGuide: "unavailable" }
  ),
  faq: defineSection(
    () => import("@/components/sections/accordion/faq/FaqPublicSection"),
    { loadStatic: () => import("@/components/sections/accordion/faq/FaqStatic") }
  ),
  faq_two_column: defineSection(
    () => import("@/components/sections/accordion/faq-two-column/FaqTwoColumnPublicSection"),
    { loadStatic: () => import("@/components/sections/accordion/faq-two-column/FaqTwoColumnStatic") }
  ),
  feature_spotlight: defineSection(
    () => import("@/components/sections/features/feature-spotlight/FeatureSpotlightPublicSection"),
    { loadStatic: () => import("@/components/sections/features/feature-spotlight/FeatureSpotlightStatic") }
  ),
  feature_tabs: defineSection(
    () => import("@/components/sections/tabs/feature-tabs/FeatureTabsPublicSection"),
    { loadStatic: () => import("@/components/sections/tabs/feature-tabs/FeatureTabsStatic") }
  ),
  form_split: defineSection(
    () => import("@/components/sections/forms/form-split/FormSplitPublicSection"),
    { loadStatic: () => import("@/components/sections/forms/form-split/FormSplitStatic") }
  ),
  hero_asymmetric: defineSection(
    () => import("@/components/sections/hero/hero-asymmetric/HeroAsymmetricPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-asymmetric/HeroAsymmetricStatic") }
  ),
  hero_centered: defineSection(
    () => import("@/components/sections/hero/hero-centered/HeroCenteredPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-centered/HeroCenteredStatic") }
  ),
  hero_classic: defineSection(
    () => import("@/components/sections/hero/hero-classic/HeroClassicPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-classic/HeroClassicStatic") }
  ),
  hero_dual_cta: defineSection(
    () => import("@/components/sections/hero/hero-dual-cta/HeroDualCtaPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-dual-cta/HeroDualCtaStatic") }
  ),
  hero_gradient_slider: defineSection(
    () =>
      import(
        "@/components/sections/hero/hero-gradient-slider/HeroGradientSliderPublicSection"
      ),
    {
      loadStatic: () =>
        import(
          "@/components/sections/hero/hero-gradient-slider/HeroGradientSliderStatic"
        ),
    }
  ),
  hero_media: defineSection(
    () => import("@/components/sections/hero/hero-media/HeroMediaPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-media/HeroMediaStatic") }
  ),
  hero_minimal: defineSection(
    () => import("@/components/sections/hero/hero-minimal/HeroMinimalPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-minimal/HeroMinimalStatic") }
  ),
  hero_split: defineSection(
    () => import("@/components/sections/hero/hero-split/HeroSplitPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-split/HeroSplitStatic") }
  ),
  hero_stats: defineSection(
    () => import("@/components/sections/hero/hero-stats/HeroStatsPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/hero-stats/HeroStatsStatic") }
  ),
  horizon_gallery: defineSection(
    () => import("@/components/sections/content/horizon-gallery/HorizonGalleryPublicSection"),
    { loadStatic: () => import("@/components/sections/content/horizon-gallery/HorizonGalleryStatic") }
  ),
  in_page_nav: defineSection(
    () => import("@/components/sections/navigation/in-page-nav/InPageNavPublicSection"),
    { loadStatic: () => import("@/components/sections/navigation/in-page-nav/InPageNavStatic") }
  ),
  key_benefits: defineSection(
    () => import("@/components/sections/features/key-benefits/KeyBenefitsPublicSection"),
    { loadStatic: () => import("@/components/sections/features/key-benefits/KeyBenefitsStatic") }
  ),
  latest_blogs: defineSection(
    () => import("@/components/sections/content/latest-blogs/LatestBlogsPublicSection"),
    { loadStatic: () => import("@/components/sections/content/latest-blogs/LatestBlogsStatic") }
  ),
  learning_path: defineSection(
    () => import("@/components/sections/learning/learning-path/LearningPathPublicSection"),
    { loadStatic: () => import("@/components/sections/learning/learning-path/LearningPathStatic") }
  ),
  masonry_quotes: defineSection(
    () => import("@/components/sections/social_proof/masonry-quotes/MasonryQuotesPublicSection"),
    { loadStatic: () => import("@/components/sections/social_proof/masonry-quotes/MasonryQuotesStatic") }
  ),
  media_mosaic: defineSection(
    () => import("@/components/sections/media/media-mosaic/MediaMosaicPublicSection"),
    { loadStatic: () => import("@/components/sections/media/media-mosaic/MediaMosaicStatic") }
  ),
  metric_rail: defineSection(
    () => import("@/components/sections/data/metric-rail/MetricRailPublicSection"),
    { loadStatic: () => import("@/components/sections/data/metric-rail/MetricRailStatic") }
  ),
  newsletter_band: defineSection(
    () => import("@/components/sections/forms/newsletter-band/NewsletterBandPublicSection"),
    { loadStatic: () => import("@/components/sections/forms/newsletter-band/NewsletterBandStatic") }
  ),
  orbit_hero: defineSection(
    () => import("@/components/sections/hero/orbit-hero/OrbitHeroPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/orbit-hero/OrbitHeroStatic") }
  ),
  overview: defineSection(
    () => import("@/components/sections/content/overview/OverviewPublicSection"),
    { loadStatic: () => import("@/components/sections/content/overview/OverviewStatic") }
  ),
  partners_marquee: defineSection(
    () => import("@/components/sections/social_proof/partners-marquee/PartnersMarqueePublicSection"),
    { loadStatic: () => import("@/components/sections/social_proof/partners-marquee/PartnersMarqueeStatic") }
  ),
  pillar_destinations: defineSection(
    () => import("@/components/sections/features/pillar-destinations/PillarDestinationsPublicSection"),
    { loadStatic: () => import("@/components/sections/features/pillar-destinations/PillarDestinationsStatic") }
  ),
  pricing_tiers: defineSection(
    () => import("@/components/sections/content/pricing-tiers/PricingTiersPublicSection"),
    { loadStatic: () => import("@/components/sections/content/pricing-tiers/PricingTiersStatic") }
  ),
  process_steps: defineSection(
    () => import("@/components/sections/features/process-steps/ProcessStepsPublicSection"),
    { loadStatic: () => import("@/components/sections/features/process-steps/ProcessStepsStatic") }
  ),
  products: defineSection(
    () => import("@/components/sections/catalog/products/ProductsPublicSection"),
    { userGuide: "unavailable" }
  ),
  promo_modal: defineSection(
    () => import("@/components/sections/overlays/promo-modal/PromoModalPublicSection"),
    { userGuide: "special" }
  ),
  related_courses: defineSection(
    () => import("@/components/sections/catalog/related-courses/RelatedCoursesPublicSection"),
    { userGuide: "unavailable" }
  ),
  resources: defineSection(
    () => import("@/components/sections/catalog/resources/ResourcesPublicSection"),
    { loadStatic: () => import("@/components/sections/catalog/resources/ResourcesStatic") }
  ),
  site_builder_hero: defineSection(
    () => import("@/components/sections/hero/site-builder-hero/SiteBuilderHeroPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/site-builder-hero/SiteBuilderHeroStatic") }
  ),
  split_cta: defineSection(
    () => import("@/components/sections/cta/split-cta/SplitCtaPublicSection"),
    { loadStatic: () => import("@/components/sections/cta/split-cta/SplitCtaStatic") }
  ),
  split_narrative: defineSection(
    () => import("@/components/sections/content/split-narrative/SplitNarrativePublicSection"),
    { loadStatic: () => import("@/components/sections/content/split-narrative/SplitNarrativeStatic") }
  ),
  statement_band: defineSection(
    () => import("@/components/sections/hero/statement-band/StatementBandPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/statement-band/StatementBandStatic") }
  ),
  stats: defineSection(
    () => import("@/components/sections/data/stats/StatsPublicSection"),
    { loadStatic: () => import("@/components/sections/data/stats/StatsStatic") }
  ),
  tabs_horizontal: defineSection(
    () => import("@/components/sections/tabs/tabs-horizontal/TabsHorizontalPublicSection"),
    { loadStatic: () => import("@/components/sections/tabs/tabs-horizontal/TabsHorizontalStatic") }
  ),
  tabs_success_stories: defineSection(
    () => import("@/components/sections/tabs/success-stories/TabsSuccessStoriesPublicSection"),
    { loadStatic: () => import("@/components/sections/tabs/success-stories/TabsSuccessStoriesStatic") }
  ),
  tabs_underline: defineSection(
    () => import("@/components/sections/tabs/tabs-underline/TabsUnderlinePublicSection"),
    { loadStatic: () => import("@/components/sections/tabs/tabs-underline/TabsUnderlineStatic") }
  ),
  team: defineSection(
    () => import("@/components/sections/features/team/TeamPublicSection"),
    { loadStatic: () => import("@/components/sections/features/team/TeamStatic") }
  ),
  template_gallery: defineSection(
    () => import("@/components/sections/content/template-gallery/TemplateGalleryPublicSection"),
    { loadStatic: () => import("@/components/sections/content/template-gallery/TemplateGalleryStatic") }
  ),
  testimonials: defineSection(
    () => import("@/components/sections/social_proof/testimonials/TestimonialsPublicSection"),
    { loadStatic: () => import("@/components/sections/social_proof/testimonials/TestimonialsStatic") }
  ),
  text_media: defineSection(
    () => import("@/components/sections/content/text-media/TextMediaPublicSection"),
    { loadStatic: () => import("@/components/sections/content/text-media/TextMediaStatic") }
  ),
  timeline_vertical: defineSection(
    () => import("@/components/sections/timeline/timeline-vertical/TimelineVerticalPublicSection"),
    { loadStatic: () => import("@/components/sections/timeline/timeline-vertical/TimelineVerticalStatic") }
  ),
  training_options: defineSection(
    () => import("@/components/sections/features/training-options/TrainingOptionsPublicSection"),
    { loadStatic: () => import("@/components/sections/features/training-options/TrainingOptionsStatic") }
  ),
  trust_badges: defineSection(
    () => import("@/components/sections/trust/trust-badges/TrustBadgesPublicSection"),
    { loadStatic: () => import("@/components/sections/trust/trust-badges/TrustBadgesStatic") }
  ),
  video_banner: defineSection(
    () => import("@/components/sections/hero/video-banner/VideoBannerPublicSection"),
    { loadStatic: () => import("@/components/sections/hero/video-banner/VideoBannerStatic") }
  ),
  vendor_link_grid: defineSection(
    () =>
      import(
        "@/components/sections/content/vendor-links-grid/VendorLinksGridPublicSection"
      ),
    {
      loadStatic: () =>
        import(
          "@/components/sections/content/vendor-links-grid/VendorLinksGridStatic"
        ),
    }
  ),
  website_build_steps: defineSection(
    () => import("@/components/sections/content/website-build-steps/WebsiteBuildStepsPublicSection"),
    { loadStatic: () => import("@/components/sections/content/website-build-steps/WebsiteBuildStepsStatic") }
  ),
  why_choose: defineSection(
    () => import("@/components/sections/features/why-choose/WhyChoosePublicSection"),
    { loadStatic: () => import("@/components/sections/features/why-choose/WhyChooseStatic") }
  ),
};
