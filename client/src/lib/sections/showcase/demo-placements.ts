/**
 * Catalog preview placements from per-section `lib/static-demo.ts`.
 * Prefer this over the legacy `sampleForKey` switch in static-samples.
 */
import { showcaseBtn, showcaseItem } from "./helpers";
import { OVERVIEW_STATIC_DEMO } from "@/components/sections/content/overview/lib/static-demo";
import { CTA_BAND_STATIC_DEMO } from "@/components/sections/content/cta-band/lib/static-demo";
import { CONTACT_US_STATIC_DEMO } from "@/components/sections/content/contact-us/lib/static-demo";
import { SPLIT_CTA_STATIC_DEMO } from "@/components/sections/cta/split-cta/lib/static-demo";
import { DOMAIN_SEARCH_BAND_STATIC_DEMO } from "@/components/sections/content/domain-search-band/lib/static-demo";
import { HORIZON_GALLERY_STATIC_DEMO } from "@/components/sections/content/horizon-gallery/lib/static-demo";
import { SPLIT_NARRATIVE_STATIC_DEMO } from "@/components/sections/content/split-narrative/lib/static-demo";
import { TEMPLATE_GALLERY_STATIC_DEMO } from "@/components/sections/content/template-gallery/lib/static-demo";
import { WEBSITE_BUILD_STEPS_STATIC_DEMO } from "@/components/sections/content/website-build-steps/lib/static-demo";
import { FEATURE_SPOTLIGHT_STATIC_DEMO } from "@/components/sections/features/feature-spotlight/lib/static-demo";
import { PILLAR_DESTINATIONS_STATIC_DEMO } from "@/components/sections/features/pillar-destinations/lib/static-demo";
import { TEAM_STATIC_DEMO } from "@/components/sections/features/team/lib/static-demo";
import { WHY_CHOOSE_STATIC_DEMO } from "@/components/sections/features/why-choose/lib/static-demo";
import { PROCESS_STEPS_STATIC_DEMO } from "@/components/sections/features/process-steps/lib/static-demo";
import { TRAINING_OPTIONS_STATIC_DEMO } from "@/components/sections/features/training-options/lib/static-demo";
import { KEY_BENEFITS_STATIC_DEMO } from "@/components/sections/features/key-benefits/lib/static-demo";
import { BENTO_GRID_STATIC_DEMO } from "@/components/sections/features/bento-grid/lib/static-demo";
import { FAQ_STATIC_DEMO } from "@/components/sections/accordion/faq/lib/static-demo";
import { FAQ_TWO_COLUMN_STATIC_DEMO } from "@/components/sections/accordion/faq-two-column/lib/static-demo";
import { FORM_SPLIT_STATIC_DEMO } from "@/components/sections/forms/form-split/lib/static-demo";
import { NEWSLETTER_BAND_STATIC_DEMO } from "@/components/sections/forms/newsletter-band/lib/static-demo";
import { PROMO_MODAL_STATIC_DEMO } from "@/components/sections/overlays/promo-modal/lib/static-demo";
import { PRICING_TIERS_STATIC_DEMO } from "@/components/sections/content/pricing-tiers/lib/static-demo";
import { STATS_STATIC_DEMO } from "@/components/sections/data/stats/lib/static-demo";
import { METRIC_RAIL_STATIC_DEMO } from "@/components/sections/data/metric-rail/lib/static-demo";
import { MASONRY_QUOTES_STATIC_DEMO } from "@/components/sections/social_proof/masonry-quotes/lib/static-demo";
import { TESTIMONIALS_STATIC_DEMO } from "@/components/sections/social_proof/testimonials/lib/static-demo";
import { TRUST_BADGES_STATIC_DEMO } from "@/components/sections/trust/trust-badges/lib/static-demo";
import { TIMELINE_VERTICAL_STATIC_DEMO } from "@/components/sections/timeline/timeline-vertical/lib/static-demo";

type DemoPlacement = Record<string, unknown>;

function itemsFromUi(
  list: Array<Record<string, unknown>> | undefined,
  mapItem: (row: Record<string, unknown>, i: number) => Record<string, unknown>
) {
  if (!Array.isArray(list)) return undefined;
  return list.map((row, i) =>
    showcaseItem(mapItem(row as Record<string, unknown>, i), i)
  );
}

function fromPlacementDemo(demo: Record<string, unknown>): DemoPlacement {
  const items = Array.isArray(demo.items)
    ? demo.items.map((row, i) =>
        showcaseItem(
          {
            ...(row as Record<string, unknown>),
            id: undefined,
          },
          i
        )
      )
    : undefined;
  return {
    ...demo,
    ...(items ? { items } : {}),
  };
}

function fromTitleDemo(demo: {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  section_title?: string;
  sub_title?: string;
  items?: Array<Record<string, unknown>>;
  buttons?: unknown[];
  data?: unknown;
  section_img_url?: string;
}): DemoPlacement {
  return {
    section_title: demo.section_title ?? demo.title,
    sub_title: demo.sub_title ?? demo.subtitle,
    in_page_nav_title: demo.eyebrow,
    section_img_url: demo.section_img_url,
    data: demo.data,
    buttons: demo.buttons,
    items: itemsFromUi(demo.items, (row) => ({
      ...row,
      title: String(row.title || row.question || row.author || ""),
      body: String(row.body || row.answer || row.quote || ""),
      subtitle: row.subtitle,
      value: row.value,
      image_url: row.imageUrl || row.image_url || row.logoUrl,
      href: row.href,
      icon: row.icon,
      label: row.label,
    })),
  };
}

const DEMO_PLACEMENTS: Record<string, () => DemoPlacement> = {
  overview: () => fromPlacementDemo({ ...OVERVIEW_STATIC_DEMO }),
  cta_band: () =>
    fromPlacementDemo({
      ...CTA_BAND_STATIC_DEMO,
      buttons: [
        showcaseBtn("Talk to us", { target_url: "/contact-us" }),
        showcaseBtn("Browse catalog", {
          variant: "secondary",
          target_url: "/courses",
        }),
      ],
    }),
  contact_us: () => fromPlacementDemo({ ...CONTACT_US_STATIC_DEMO }),
  split_cta: () =>
    fromPlacementDemo({
      ...SPLIT_CTA_STATIC_DEMO,
      buttons: [
        showcaseBtn("Get started", { target_url: "/contact" }),
        showcaseBtn("Section library", {
          variant: "secondary",
          target_url: "/cms/section",
        }),
      ],
    }),
  domain_search_band: () =>
    fromPlacementDemo({ ...DOMAIN_SEARCH_BAND_STATIC_DEMO }),
  horizon_gallery: () => fromPlacementDemo({ ...HORIZON_GALLERY_STATIC_DEMO }),
  split_narrative: () => fromPlacementDemo({ ...SPLIT_NARRATIVE_STATIC_DEMO }),
  template_gallery: () => fromPlacementDemo({ ...TEMPLATE_GALLERY_STATIC_DEMO }),
  website_build_steps: () =>
    fromPlacementDemo({ ...WEBSITE_BUILD_STEPS_STATIC_DEMO }),
  feature_spotlight: () =>
    fromPlacementDemo({ ...FEATURE_SPOTLIGHT_STATIC_DEMO }),
  pillar_destinations: () =>
    fromPlacementDemo({ ...PILLAR_DESTINATIONS_STATIC_DEMO }),
  team: () => fromPlacementDemo({ ...TEAM_STATIC_DEMO }),
  newsletter_band: () => fromPlacementDemo({ ...NEWSLETTER_BAND_STATIC_DEMO }),
  promo_modal: () => fromPlacementDemo({ ...PROMO_MODAL_STATIC_DEMO }),
  why_choose: () => fromTitleDemo({ ...WHY_CHOOSE_STATIC_DEMO }),
  process_steps: () => fromTitleDemo({ ...PROCESS_STEPS_STATIC_DEMO }),
  training_options: () => fromTitleDemo({ ...TRAINING_OPTIONS_STATIC_DEMO }),
  key_benefits: () => fromTitleDemo({ ...KEY_BENEFITS_STATIC_DEMO }),
  bento_grid: () => fromTitleDemo({ ...BENTO_GRID_STATIC_DEMO }),
  faq: () => fromTitleDemo({ ...FAQ_STATIC_DEMO }),
  faq_two_column: () => fromTitleDemo({ ...FAQ_TWO_COLUMN_STATIC_DEMO }),
  pricing_tiers: () => fromTitleDemo({ ...PRICING_TIERS_STATIC_DEMO }),
  stats: () => fromTitleDemo({ ...STATS_STATIC_DEMO }),
  metric_rail: () => fromTitleDemo({ ...METRIC_RAIL_STATIC_DEMO }),
  masonry_quotes: () => fromTitleDemo({ ...MASONRY_QUOTES_STATIC_DEMO }),
  testimonials: () => fromTitleDemo({ ...TESTIMONIALS_STATIC_DEMO }),
  trust_badges: () => fromTitleDemo({ ...TRUST_BADGES_STATIC_DEMO }),
  timeline_vertical: () => fromTitleDemo({ ...TIMELINE_VERTICAL_STATIC_DEMO }),
  form_split: () =>
    fromPlacementDemo({
      section_title: FORM_SPLIT_STATIC_DEMO.section_title,
      sub_title: FORM_SPLIT_STATIC_DEMO.sub_title,
      data: FORM_SPLIT_STATIC_DEMO.data,
      items: FORM_SPLIT_STATIC_DEMO.highlights.map((row, i) =>
        showcaseItem(
          { title: row.title, subtitle: row.subtitle, id: row.id },
          i
        )
      ),
    }),
};

/** Placement props for `/cms/section/...` when a per-section static-demo exists. */
export function getStaticDemoPlacement(
  sectionKey: string
): DemoPlacement | null {
  const key = String(sectionKey || "")
    .trim()
    .toLowerCase();
  const factory = DEMO_PLACEMENTS[key];
  if (!factory) return null;
  return factory();
}

export function hasStaticDemoPlacement(sectionKey: string) {
  return Boolean(
    DEMO_PLACEMENTS[
      String(sectionKey || "")
        .trim()
        .toLowerCase()
    ]
  );
}
