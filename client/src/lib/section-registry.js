import OverviewSection from "@/components/sections/OverviewSection";
import KeyBenefitsSection from "@/components/sections/KeyBenefitsSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import StatsSection from "@/components/sections/StatsSection";
import RelatedCoursesSection from "@/components/sections/RelatedCoursesSection";
import CurriculumSection from "@/components/sections/CurriculumSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { CustomerTestimonialsCarousel } from "@/components/sections/testimonials";
import FaqSection from "@/components/sections/FaqSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import ProductsSection from "@/components/sections/ProductsSection";
import CatalogSection from "@/components/sections/CatalogSection";
import EntityDirectorySection from "@/components/sections/EntityDirectorySection";
import LatestBlogsSection from "@/components/sections/LatestBlogsSection";
import BlogDirectorySection from "@/components/sections/BlogDirectorySection";
import {
  HeroClassicSection,
  HeroSplitSection,
  HeroCenteredSection,
  HeroMinimalSection,
  HeroMediaSection,
  HeroStatsSection,
  HeroAsymmetricSection,
  HeroDualCtaSection,
} from "@/components/sections/hero";
import { PartnersMarqueeSection } from "@/components/sections/partners";
import {
  TrainingOptionsSection,
  AwardsSection,
} from "@/components/sections/cards";
import InPageNavSection from "@/components/sections/InPageNavSection";
import TextMediaSection from "@/components/sections/text-media/TextMediaSection";
import TeamSection from "@/components/sections/TeamSection";
import EditorialBannerSection from "@/components/sections/EditorialBannerSection";
import FeatureSpotlightSection from "@/components/sections/FeatureSpotlightSection";
import ProcessStepsSection from "@/components/sections/ProcessStepsSection";
import CtaBandSection from "@/components/sections/CtaBandSection";
import ContactUsSection from "@/components/sections/ContactUsSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import StatementBandSection from "@/components/sections/StatementBandSection";
import BentoGridSection from "@/components/sections/BentoGridSection";
import HorizonGallerySection from "@/components/sections/HorizonGallerySection";
import SplitNarrativeSection from "@/components/sections/SplitNarrativeSection";
import PillarDestinationsSection from "@/components/sections/PillarDestinationsSection";
import OrbitHeroSection from "@/components/sections/OrbitHeroSection";
import CardStackSection from "@/components/sections/CardStackSection";
import FeatureTabsSection from "@/components/sections/FeatureTabsSection";
import PricingTiersSection from "@/components/sections/PricingTiersSection";
import MasonryQuotesSection from "@/components/sections/MasonryQuotesSection";
import MetricRailSection from "@/components/sections/MetricRailSection";
import SiteBuilderHeroSection from "@/components/sections/SiteBuilderHeroSection";
import TemplateGallerySection from "@/components/sections/TemplateGallerySection";
import BuilderFeatureCardsSection from "@/components/sections/BuilderFeatureCardsSection";
import DomainSearchBandSection from "@/components/sections/DomainSearchBandSection";
import WebsiteBuildStepsSection from "@/components/sections/WebsiteBuildStepsSection";
import VideoBannerSection from "@/components/sections/VideoBannerSection";
import CastProfilesSection from "@/components/sections/CastProfilesSection";

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
  customer_testimonials: CustomerTestimonialsCarousel,
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
};

/**
 * Surface mode:
 *  - "alt"   → participates in white / grey alternating page backgrounds
 *  - "fixed" → section owns its own background (e.g. dark CTA) — skip alternating
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
  contact_us: "fixed",
  contact_form: "alt",
  statement_band: "fixed",
  bento_grid: "alt",
  horizon_gallery: "fixed",
  split_narrative: "alt",
  pillar_destinations: "alt",
  orbit_hero: "fixed",
  card_stack: "alt",
  feature_tabs: "alt",
  pricing_tiers: "alt",
  masonry_quotes: "alt",
  metric_rail: "fixed",
  site_builder_hero: "fixed",
  template_gallery: "fixed",
  builder_feature_cards: "alt",
  domain_search_band: "fixed",
  website_build_steps: "alt",
  video_banner: "fixed",
  cast_profiles: "alt",
  why_choose: "fixed",
  stats: "fixed",
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
  hero_classic: "fixed",
  hero_split: "fixed",
  hero_centered: "fixed",
  hero_minimal: "fixed",
  hero_media: "fixed",
  hero_stats: "fixed",
  hero_asymmetric: "fixed",
  hero_dual_cta: "fixed",
};

export function sectionUsesAltSurface(key) {
  return SECTION_SURFACE[String(key || "").toLowerCase()] !== "fixed";
}

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

export function sectionUsesImage(key) {
  return SECTION_USES_IMAGE.has(String(key || "").toLowerCase());
}

export {
  SECTION_ITEMS_CONFIG,
  sectionUsesItems,
  getSectionItemsConfig,
  sectionRequiresItems,
} from "./section-items-config.js";

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
  { key: "cta_band", name: "CTA Band", category: "content", tags: ["cta", "band"] },
  { key: "contact_us", name: "Contact Us", category: "content", tags: ["contact", "global"] },
  { key: "contact_form", name: "Contact Form", category: "content", tags: ["contact", "form", "enterprise"] },
  { key: "statement_band", name: "Statement Band", category: "hero", tags: ["hero", "typography"] },
  { key: "bento_grid", name: "Bento Grid", category: "features", tags: ["bento", "mosaic"] },
  { key: "horizon_gallery", name: "Horizon Gallery", category: "content", tags: ["gallery", "slider"] },
  { key: "split_narrative", name: "Split Narrative", category: "content", tags: ["story", "sticky"] },
  { key: "pillar_destinations", name: "Pillar Destinations", category: "features", tags: ["pillars", "links"] },
  { key: "orbit_hero", name: "Orbit Hero", category: "hero", tags: ["hero", "product-frame"] },
  { key: "card_stack", name: "Card Stack", category: "features", tags: ["stack", "scroll"] },
  { key: "feature_tabs", name: "Feature Tabs", category: "features", tags: ["tabs", "preview"] },
  { key: "pricing_tiers", name: "Pricing Tiers", category: "content", tags: ["pricing", "plans"] },
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
  { key: "partners", name: "Partners", category: "social_proof", tags: ["logos", "partners"] },
  { key: "partners_marquee", name: "Partners — Logo Marquee", category: "social_proof", tags: ["logos", "marquee"] },
  { key: "training_options", name: "Training Options", category: "features", tags: ["cards", "options"] },
  { key: "awards", name: "Awards & Recognition", category: "social_proof", tags: ["awards", "cards"] },
  { key: "in_page_nav", name: "In-Page Navigation", category: "navigation", tags: ["sticky", "links"] },
  { key: "testimonials", name: "Testimonials", category: "social_proof", tags: ["quotes", "reviews"] },
  { key: "customer_testimonials", name: "Customer Testimonials", category: "social_proof", tags: ["carousel", "reviews"] },
  { key: "faq", name: "FAQ", category: "accordion", tags: ["accordion", "questions"] },
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
  { key: "accordion", name: "Accordion" },
  { key: "catalog", name: "Catalog & learning" },
  { key: "social_proof", name: "Social proof" },
  { key: "data", name: "Data & stats" },
  { key: "navigation", name: "Navigation" },
];

/** Fixed metadata for a registered section component. */
export function getSectionCatalogMeta(key) {
  const normalized = String(key || "").toLowerCase();
  return SECTION_CATALOG.find((section) => section.key === normalized) || null;
}

/** True when a React renderer exists for this section key */
export function isKnownSectionKey(key) {
  const k = String(key || "").toLowerCase();
  return Boolean(SECTION_COMPONENTS[k]);
}
