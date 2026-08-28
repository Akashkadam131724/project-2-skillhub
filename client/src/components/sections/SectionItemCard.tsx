"use client";

import dynamic from "next/dynamic";
import { itemTitle } from "@/lib/sections/item-types";

const FaqItemCard = dynamic(() =>
  import("@/components/sections/accordion/shared/FaqItemCard")
);
const BenefitItemCard = dynamic(() =>
  import("@/components/sections/features/key-benefits/BenefitItemCard")
);
const StatItemCard = dynamic(() =>
  import("@/components/sections/data/stats/StatItemCard")
);
const TestimonialItemCard = dynamic(() =>
  import("@/components/sections/social_proof/testimonials/TestimonialItemCard")
);
const CustomerTestimonialItemCard = dynamic(() =>
  import(
    "@/components/sections/social_proof/customer-testimonials/CustomerTestimonialItemCard"
  )
);
const ResourceItemCard = dynamic(() =>
  import("@/components/sections/catalog/resources/ResourceItemCard")
);
const TextMediaItemCard = dynamic(() =>
  import("@/components/sections/content/text-media/TextMediaItemCard")
);
const CurriculumItemCard = dynamic(() =>
  import("@/components/sections/catalog/curriculum/CurriculumItemCard")
);
const WhyChooseItemCard = dynamic(() =>
  import("@/components/sections/features/why-choose/WhyChooseItemCard")
);
const HeroBannerItemCard = dynamic(() =>
  import("@/components/sections/hero/shared/HeroBannerItemCard")
);
const PartnerItemCard = dynamic(() =>
  import("@/components/sections/social_proof/partners-marquee/PartnerItemCard")
);
const TrustBadgeItemCard = dynamic(() =>
  import("@/components/sections/trust/trust-badges/TrustBadgeItemCard")
);
const TimelineVerticalItemCard = dynamic(() =>
  import("@/components/sections/timeline/timeline-vertical/TimelineVerticalItemCard")
);
const GenericItemPreviewCard = dynamic(() =>
  import("@/components/sections/shared/GenericItemPreviewCard")
);
const TrainingOptionCard = dynamic(() =>
  import("@/components/sections/features/cards/TrainingOptionCard")
);
const AwardCard = dynamic(() =>
  import("@/components/sections/features/cards/AwardCard")
);

/** Map SECTION_ITEMS_CONFIG.preview → GenericItemPreviewCard layout */
const GENERIC_LAYOUTS = {
  comparison_row: "comparison",
  mosaic_tile: "media",
  timeline_step: "step",
  trust_badge: "media",
  learning_step: "step",
  form_highlight: "media",
  team_member: "team",
  spotlight: "overlay",
  process_step: "step",
  contact_channel: "contact",
  bento_cell: "overlay",
  gallery_panel: "overlay",
  story_chapter: "overlay",
  pillar: "overlay",
  stack_card: "overlay",
  feature_tab: "tab",
  success_story: "success_story",
  pricing_plan: "pricing",
  template_card: "media",
  builder_feature: "step",
  domain_chip: "chip",
  build_step: "step",
  cast_profile: "portrait",
} as const;

type GenericLayoutKey = keyof typeof GENERIC_LAYOUTS;
type GenericLayout = (typeof GENERIC_LAYOUTS)[GenericLayoutKey];

type SectionItem = Record<string, unknown> | null | undefined;
type CardVariant = "light" | "dark";

export type SectionItemCardProps = {
  type?: string;
  item?: SectionItem;
  preview?: boolean;
  className?: string;
  index?: number;
  variant?: CardVariant | string;
  onDarkBand?: boolean;
};

/**
 * Dispatch by SECTION_ITEMS_CONFIG.preview key.
 * Dedicated cards first; otherwise GenericItemPreviewCard layout for CMS.
 */
export default function SectionItemCard({
  type,
  item,
  preview = false,
  className,
  index = 0,
  variant,
  onDarkBand = false,
}: SectionItemCardProps) {
  if (!item && !preview) return null;

  const cardVariant: CardVariant = variant === "light" ? "light" : "dark";

  switch (type) {
    case "faq":
      return (
        <FaqItemCard
          item={item}
          preview={preview}
          index={index}
          onDarkBand={onDarkBand}
        />
      );
    case "benefit":
      return <BenefitItemCard item={item} preview={preview} />;
    case "why_choose":
      return (
        <WhyChooseItemCard
          item={item}
          preview={preview}
          index={index}
          variant={cardVariant}
        />
      );
    case "stat":
      if (preview) {
        return (
          <div className="section-ui-card rounded-xl border px-4 py-3">
            <StatItemCard
              item={item ?? undefined}
              preview
              className={className}
              variant={cardVariant}
            />
          </div>
        );
      }
      return (
        <StatItemCard
          item={item ?? undefined}
          preview={preview}
          className={className}
          variant={cardVariant}
        />
      );
    case "testimonial":
      return <TestimonialItemCard item={item} preview={preview} />;
    case "customer_testimonial":
      return <CustomerTestimonialItemCard item={item} preview={preview} />;
    case "resource":
      return <ResourceItemCard item={item} preview={preview} />;
    case "text_media":
      return <TextMediaItemCard item={item} preview={preview} />;
    case "curriculum":
      return <CurriculumItemCard item={item} preview={preview} />;
    case "hero_banner":
      return <HeroBannerItemCard item={item} preview={preview} />;
    case "training_option":
      return (
        <TrainingOptionCard
          item={item}
          preview={preview}
          index={index}
          onDarkBand={onDarkBand}
        />
      );
    case "award":
      return <AwardCard item={item} preview={preview} />;
    case "partner":
      return <PartnerItemCard item={item} preview={preview} />;
    case "trust_badge":
      return <TrustBadgeItemCard item={item} preview={preview} />;
    case "timeline_step":
      return (
        <TimelineVerticalItemCard item={item} preview={preview} index={index} />
      );
    default: {
      const layout = type
        ? GENERIC_LAYOUTS[type as GenericLayoutKey]
        : undefined;
      if (layout && preview) {
        return (
          <GenericItemPreviewCard
            layout={layout as GenericLayout}
            item={item}
            index={index}
          />
        );
      }
      return (
        <div className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">
          {itemTitle(item) || "Item"}
        </div>
      );
    }
  }
}
