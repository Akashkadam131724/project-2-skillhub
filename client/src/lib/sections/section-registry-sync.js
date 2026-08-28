/**
 * Eager section components — CMS live edit / preview only.
 * Public pages use section-component-loaders.js (reads section-manifest.ts).
 */
import {
  OverviewSection,
  CtaBandSection,
  ContactUsSection,
  ContactFormSection,
  HorizonGallerySection,
  SplitNarrativeSection,
  PricingTiersSection,
  TemplateGallerySection,
  DomainSearchBandSection,
  WebsiteBuildStepsSection,
  LatestBlogsSection,
  TextMediaSection,
  VendorLinksGridSection,
  SarderEcosystemSection,
} from "@/components/sections/content";
import {
  KeyBenefitsSection,
  TeamSection,
  FeatureSpotlightSection,
  ProcessStepsSection,
  BentoGridSection,
  PillarDestinationsSection,
  CardStackSection,
  BuilderFeatureCardsSection,
  CastProfilesSection,
  WhyChooseSection,
  TrainingOptionsSection,
  AwardsSection,
} from "@/components/sections/features";
import {
  HeroClassicSection,
  HeroSplitSection,
  HeroCenteredSection,
  HeroMinimalSection,
  HeroMediaSection,
  HeroStatsSection,
  HeroAsymmetricSection,
  HeroDualCtaSection,
  HeroGradientSliderSection,
  EditorialBannerSection,
  StatementBandSection,
  OrbitHeroSection,
  SiteBuilderHeroSection,
  VideoBannerSection,
} from "@/components/sections/hero";
import {
  FeatureTabsSection,
  TabsHorizontalSection,
  TabsUnderlineSection,
  TabsSuccessStoriesSection,
} from "@/components/sections/tabs";
import { FaqSection, FaqTwoColumnSection } from "@/components/sections/accordion";
import {
  RelatedCoursesSection,
  CurriculumSection,
  ResourcesSection,
  ProductsSection,
  CatalogSection,
  EntityDirectorySection,
  BlogDirectorySection,
} from "@/components/sections/catalog";
import {
  MasonryQuotesSection,
  TestimonialsSection,
  CustomerTestimonialsSection,
  PartnersMarqueeSection,
} from "@/components/sections/social_proof";
import { StatsSection, MetricRailSection } from "@/components/sections/data";
import { InPageNavSection } from "@/components/sections/navigation";
import { PromoModalSection } from "@/components/sections/overlays";
import { NewsletterBandSection, FormSplitSection } from "@/components/sections/forms";
import { ComparisonTableSection } from "@/components/sections/comparison";
import { MediaMosaicSection } from "@/components/sections/media";
import { TimelineVerticalSection } from "@/components/sections/timeline";
import { TrustBadgesSection } from "@/components/sections/trust";
import { SplitCtaSection } from "@/components/sections/cta";
import { LearningPathSection } from "@/components/sections/learning";
import { resolveSectionBehaviorKey } from "./section-items-config.js";

/** key → React component (do not rename keys without a code change) */
export const SECTION_COMPONENTS = {
  overview: OverviewSection,
  text_media: TextMediaSection,
  key_benefits: KeyBenefitsSection,
  team: TeamSection,
  editorial_banner: EditorialBannerSection,
  feature_spotlight: FeatureSpotlightSection,
  process_steps: ProcessStepsSection,
  cta_band: CtaBandSection,
  contact_us: ContactUsSection,
  contact_form: ContactFormSection,
  statement_band: StatementBandSection,
  bento_grid: BentoGridSection,
  horizon_gallery: HorizonGallerySection,
  split_narrative: SplitNarrativeSection,
  pillar_destinations: PillarDestinationsSection,
  orbit_hero: OrbitHeroSection,
  card_stack: CardStackSection,
  feature_tabs: FeatureTabsSection,
  tabs_vertical: FeatureTabsSection,
  tabs_horizontal: TabsHorizontalSection,
  tabs_underline: TabsUnderlineSection,
  tabs_success_stories: TabsSuccessStoriesSection,
  pricing_tiers: PricingTiersSection,
  masonry_quotes: MasonryQuotesSection,
  metric_rail: MetricRailSection,
  site_builder_hero: SiteBuilderHeroSection,
  template_gallery: TemplateGallerySection,
  builder_feature_cards: BuilderFeatureCardsSection,
  domain_search_band: DomainSearchBandSection,
  website_build_steps: WebsiteBuildStepsSection,
  video_banner: VideoBannerSection,
  cast_profiles: CastProfilesSection,
  why_choose: WhyChooseSection,
  stats: StatsSection,
  related_courses: RelatedCoursesSection,
  curriculum: CurriculumSection,
  partners: PartnersMarqueeSection,
  partners_marquee: PartnersMarqueeSection,
  training_options: TrainingOptionsSection,
  awards: AwardsSection,
  in_page_nav: InPageNavSection,
  testimonials: TestimonialsSection,
  customer_testimonials: CustomerTestimonialsSection,
  faq: FaqSection,
  resources: ResourcesSection,
  products: ProductsSection,
  catalog: CatalogSection,
  entity_directory: EntityDirectorySection,
  latest_blogs: LatestBlogsSection,
  blog_directory: BlogDirectorySection,
  hero_classic: HeroClassicSection,
  hero_split: HeroSplitSection,
  hero_centered: HeroCenteredSection,
  hero_minimal: HeroMinimalSection,
  hero_media: HeroMediaSection,
  hero_stats: HeroStatsSection,
  hero_asymmetric: HeroAsymmetricSection,
  hero_dual_cta: HeroDualCtaSection,
  hero_gradient_slider: HeroGradientSliderSection,
  promo_modal: PromoModalSection,
  newsletter_band: NewsletterBandSection,
  form_split: FormSplitSection,
  comparison_table: ComparisonTableSection,
  media_mosaic: MediaMosaicSection,
  timeline_vertical: TimelineVerticalSection,
  trust_badges: TrustBadgesSection,
  vendor_link_grid: VendorLinksGridSection,
  sarder_ecosystem: SarderEcosystemSection,
  split_cta: SplitCtaSection,
  learning_path: LearningPathSection,
  faq_two_column: FaqTwoColumnSection,
};

/** Resolve React component for a catalog key + optional DB render_key */
export function resolveSectionComponent(sectionKey, renderKey) {
  const behavior = resolveSectionBehaviorKey(sectionKey, renderKey);
  return SECTION_COMPONENTS[behavior] || null;
}
