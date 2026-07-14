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

/** key → React component (do not rename keys without a code change) */
export const SECTION_COMPONENTS = {
  overview: OverviewSection,
  text_media: TextMediaSection,
  key_benefits: KeyBenefitsSection,
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
]);

/**
 * Sections whose layout uses `section_bg_img`.
 * CMS BG toolbar only shows for these keys.
 */
export const SECTION_USES_BG = new Set([]);

/** Sections that edit data.bg_color (solid / gradient picker in CMS) */
export const SECTION_USES_BG_COLOR = new Set(["stats"]);

export function sectionUsesImage(key) {
  return SECTION_USES_IMAGE.has(String(key || "").toLowerCase());
}

export function sectionUsesBg(key) {
  return SECTION_USES_BG.has(String(key || "").toLowerCase());
}

export function sectionUsesBgColor(key) {
  return SECTION_USES_BG_COLOR.has(String(key || "").toLowerCase());
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

/** Labels for CMS — keys are fixed to components above */
export const SECTION_CATALOG = [
  { key: "overview", name: "Overview" },
  { key: "text_media", name: "Text + Media" },
  { key: "key_benefits", name: "Key Benefits" },
  { key: "why_choose", name: "Why Choose" },
  { key: "stats", name: "Stats Strip" },
  { key: "related_courses", name: "Related Courses" },
  { key: "curriculum", name: "Curriculum" },
  { key: "partners", name: "Partners" },
  { key: "partners_marquee", name: "Partners — Logo Marquee" },
  { key: "training_options", name: "Training Options" },
  { key: "awards", name: "Awards & Recognition" },
  { key: "in_page_nav", name: "In-Page Navigation" },
  { key: "testimonials", name: "Testimonials" },
  { key: "customer_testimonials", name: "Customer Testimonials" },
  { key: "faq", name: "FAQ" },
  { key: "resources", name: "Resources" },
  { key: "products", name: "Products Grid" },
  { key: "catalog", name: "Course Catalog" },
  { key: "hero_classic", name: "Hero — Classic" },
  { key: "hero_split", name: "Hero — Split" },
  { key: "hero_centered", name: "Hero — Centered" },
  { key: "hero_minimal", name: "Hero — Minimal" },
  { key: "hero_media", name: "Hero — Media Slider" },
  { key: "hero_stats", name: "Hero — Stats" },
  { key: "hero_asymmetric", name: "Hero — Asymmetric" },
  { key: "hero_dual_cta", name: "Hero — Dual CTA" },
];

export const KNOWN_SECTION_KEYS = SECTION_CATALOG.map((s) => s.key);

/** True when a React renderer exists for this section key */
export function isKnownSectionKey(key) {
  const k = String(key || "").toLowerCase();
  return Boolean(SECTION_COMPONENTS[k]);
}
